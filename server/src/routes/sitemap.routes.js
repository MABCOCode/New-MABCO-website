const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { validateProductContent, filterProductForCatalog } = require('../utils/productContentValidation');

const router = express.Router();

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedXml = null;
let cachedFingerprint = '';
let cachedAt = 0;

const OFFER_TYPES = ['direct_discount', 'coupon', 'free_product', 'bundle_discount'];

const toIsoDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

const pickDate = (...values) => {
  for (const value of values) {
    if (!value) continue;
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildUrl = (baseUrl, path) => {
  if (!baseUrl) return path;
  const trimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmed}${cleanPath}`;
};

const getBaseUrl = (req) => {
  const explicit = process.env.SITE_URL;
  if (explicit && String(explicit).trim().length > 0) return String(explicit).trim();
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const proto = forwardedProto || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  if (host && String(host).trim().length > 0) {
    return `${proto}://${host}`;
  }
  return 'https://mabcoonline.com';
};

const buildIfNullChain = (fields = []) => {
  const cleaned = fields.filter(Boolean);
  if (cleaned.length === 0) return null;
  if (cleaned.length === 1) return cleaned[0];
  return cleaned.reduceRight((fallback, field) => ({ $ifNull: [field, fallback] }));
};

const maxUpdatedAt = async (collection, pipelineDateFields) => {
  if (!collection) return null;
  const lastModifiedExpr = buildIfNullChain(pipelineDateFields);
  if (!lastModifiedExpr) return null;
  const pipeline = [
    {
      $project: {
        lastModified: lastModifiedExpr,
      },
    },
    { $group: { _id: null, max: { $max: '$lastModified' } } },
  ];
  const result = await collection.aggregate(pipeline).toArray();
  return result[0]?.max || null;
};

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();

  const now = Date.now();
  if (cachedXml && cachedFingerprint && now - cachedAt < CACHE_TTL_MS) {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(cachedXml);
  }

  const [productsUpdatedAt, categoriesUpdatedAt, brandsUpdatedAt, offersUpdatedAt] = await Promise.all([
    maxUpdatedAt(db.collection('products'), ['$updatedAt', '$audit.updatedAt', '$createdAt']),
    maxUpdatedAt(db.collection('categories'), ['$updatedAt', '$createdAt']),
    maxUpdatedAt(db.collection('brands'), ['$updatedAt', '$createdAt']),
    maxUpdatedAt(db.collection('offers'), ['$updatedAt', '$createdAt']),
  ]);

  const fingerprint = [
    productsUpdatedAt?.toISOString() || '',
    categoriesUpdatedAt?.toISOString() || '',
    brandsUpdatedAt?.toISOString() || '',
    offersUpdatedAt?.toISOString() || '',
  ].join('|');

  if (cachedXml && cachedFingerprint === fingerprint && now - cachedAt < CACHE_TTL_MS) {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(cachedXml);
  }

  const baseUrl = getBaseUrl(req);
  const siteLastMod = pickDate(productsUpdatedAt, categoriesUpdatedAt, brandsUpdatedAt, offersUpdatedAt, new Date());
  const siteLastModIso = toIsoDate(siteLastMod);

  const urls = [];
  const pushUrl = (path, options = {}) => {
    urls.push({
      loc: buildUrl(baseUrl, path),
      lastmod: options.lastmod || siteLastModIso,
      changefreq: options.changefreq,
      priority: options.priority,
    });
  };

  // Static public routes
  pushUrl('/', { changefreq: 'daily', priority: '1.0' });
  pushUrl('/products', { changefreq: 'daily', priority: '0.9' });
  pushUrl('/search', { changefreq: 'weekly', priority: '0.6' });
  pushUrl('/faq', { changefreq: 'monthly', priority: '0.5' });
  pushUrl('/showrooms', { changefreq: 'monthly', priority: '0.6' });
  pushUrl('/about', { changefreq: 'yearly', priority: '0.4' });
  pushUrl('/career', { changefreq: 'monthly', priority: '0.4' });
  // Do not include /sitemap (non-SEO page) in sitemap.xml

  OFFER_TYPES.forEach((type) => {
    pushUrl(`/offers/${encodeURIComponent(type)}`, { changefreq: 'daily', priority: '0.8' });
  });

  // Categories
  const categories = await db
    .collection('categories')
    .find({ isActive: { $ne: false } })
    .project({ cat_code: 1, code: 1, name: 1, nameEn: 1, updatedAt: 1, createdAt: 1 })
    .toArray();

  categories.forEach((cat) => {
    const code = cat.cat_code || cat.code;
    if (!code) return;
    const lastmod = toIsoDate(pickDate(cat.updatedAt, cat.createdAt, categoriesUpdatedAt));
    pushUrl(`/category/${encodeURIComponent(String(code))}`, {
      changefreq: 'weekly',
      priority: '0.7',
      lastmod,
    });
  });

  // Brands
  const brands = await db
    .collection('brands')
    .find({ isActive: { $ne: false } })
    .project({ brand_code: 1, category_code: 1, categoryCode: 1, updatedAt: 1, createdAt: 1 })
    .toArray();

  brands.forEach((brand) => {
    const brandCode = brand.brand_code;
    if (!brandCode) return;
    const categoryCode = brand.category_code || brand.categoryCode;
    const lastmod = toIsoDate(pickDate(brand.updatedAt, brand.createdAt, brandsUpdatedAt));
    if (categoryCode) {
      pushUrl(`/brand/${encodeURIComponent(String(categoryCode))}/${encodeURIComponent(String(brandCode))}`, {
        changefreq: 'weekly',
        priority: '0.7',
        lastmod,
      });
    } else {
      pushUrl(`/brand/${encodeURIComponent(String(brandCode))}`, {
        changefreq: 'weekly',
        priority: '0.6',
        lastmod,
      });
    }
  });

  // Products
  const productQuery = {
    'status.isHidden': { $ne: true },
    'status.isActive': { $ne: false },
    $or: [
      { 'availability.isAvailable': { $ne: false } },
      { cat_code: '09', brand_code: '81' },
    ],
  };

  const productProjection = {
    _id: 1,
    id: 1,
    slug: 1,
    stk_code: 1,
    name: 1,
    nameAr: 1,
    description: 1,
    descriptionAr: 1,
    specs: 1,
    specifications: 1,
    images: 1,
    image: 1,
    colorVariants: 1,
    chargeOptions: 1,
    category: 1,
    categoryAr: 1,
    cat_code: 1,
    brand: 1,
    brandAr: 1,
    brand_code: 1,
    updatedAt: 1,
    audit: 1,
    createdAt: 1,
    availability: 1,
    status: 1,
  };

  const products = await db.collection('products').find(productQuery, { projection: productProjection }).toArray();
  products.forEach((product) => {
    const validation = validateProductContent(product);
    if (!validation.isCatalogReady) return;
    const filtered = filterProductForCatalog(product, validation);
    const ref = filtered.slug || filtered.stk_code || filtered.id || filtered._id;
    if (!ref) return;
    const lastmod = toIsoDate(
      pickDate(filtered.updatedAt, filtered.audit?.updatedAt, filtered.createdAt, productsUpdatedAt),
    );
    pushUrl(`/product/${encodeURIComponent(String(ref))}`, {
      changefreq: 'daily',
      priority: '0.7',
      lastmod,
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((url) => {
        const parts = [
          `  <url>`,
          `    <loc>${escapeXml(url.loc)}</loc>`,
          url.lastmod ? `    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : null,
          url.changefreq ? `    <changefreq>${escapeXml(url.changefreq)}</changefreq>` : null,
          url.priority ? `    <priority>${escapeXml(url.priority)}</priority>` : null,
          `  </url>`,
        ].filter(Boolean);
        return parts.join('\n');
      })
      .join('\n') +
    `\n</urlset>`;

  cachedXml = xml;
  cachedFingerprint = fingerprint;
  cachedAt = Date.now();

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).send(xml);
}));

module.exports = router;
