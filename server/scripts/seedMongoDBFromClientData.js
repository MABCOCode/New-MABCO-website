const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'mabco_website';

const CLIENT_DATA_DIR = path.resolve(__dirname, '../../client/src/data');
const CLIENT_STATIC_DIR = path.resolve(__dirname, '../../client/public/static');
const CLIENT_TESTDATA_DIR = path.resolve(__dirname, '../../client/src/testdata');

function readFile(fileName) {
  return fs.readFileSync(path.join(CLIENT_DATA_DIR, fileName), 'utf8');
}

function readStaticJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(CLIENT_STATIC_DIR, fileName), 'utf8'));
}

function extractLiteral(source, variableName) {
  const declaration = new RegExp(`(?:export\\s+)?(?:const|let)\\s+${variableName}\\b`);
  const match = declaration.exec(source);
  if (!match) {
    throw new Error(`Variable "${variableName}" not found`);
  }

  let i = source.indexOf('=', match.index);
  if (i === -1) throw new Error(`No assignment for "${variableName}"`);
  i += 1;

  while (i < source.length && /\s/.test(source[i])) i += 1;
  const open = source[i];
  if (open !== '[' && open !== '{') {
    throw new Error(`"${variableName}" does not start with array/object literal`);
  }
  const close = open === '[' ? ']' : '}';

  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let j = i; j < source.length; j += 1) {
    const ch = source[j];
    const prev = source[j - 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (prev === '*' && ch === '/') inBlockComment = false;
      continue;
    }

    if (!inString && prev === '/' && ch === '/') {
      inLineComment = true;
      continue;
    }
    if (!inString && prev === '/' && ch === '*') {
      inBlockComment = true;
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === stringQuote) {
        inString = false;
        stringQuote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringQuote = ch;
      continue;
    }

    if (ch === open) depth += 1;
    if (ch === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(i, j + 1);
      }
    }
  }

  throw new Error(`Could not extract literal for "${variableName}"`);
}

function evalLiteral(literal) {
  return vm.runInNewContext(`(${literal})`, { Date, Math });
}

function toSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { algo: 'scrypt', salt, hash };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function listJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return listJsonFiles(fullPath);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) return [fullPath];
      return [];
    });
}

function looksLikeImageUrl(value) {
  if (!isNonEmptyString(value)) return false;
  const v = value.trim().toLowerCase();

  if (v.startsWith('/uploads/') || v.startsWith('uploads/') || v.startsWith('./uploads/')) return true;
  if (v.startsWith('//')) return true;
  if (v.includes('mabcoonline.com/images/')) return true;
  if (v.startsWith('http://') || v.startsWith('https://')) {
    if (/\.(png|jpe?g|webp|svg|gif|avif|bmp|ico)(\?|$)/i.test(v)) return true;
    if (v.includes('unsplash.com') || v.includes('img.icons8.com') || v.includes('upload.wikimedia.org')) return true;
    if (v.includes('/images/')) return true;
  }

  return false;
}

function normalizeAssetUrl(value) {
  if (!isNonEmptyString(value)) return '';
  const v = value.trim();
  if (v.startsWith('//')) return `https:${v}`;
  if (v.startsWith('mabcoonline.com/')) return `https://${v}`;
  if (v.startsWith('www.')) return `https://${v}`;
  if (v.startsWith('./uploads/')) return v.slice(1);
  if (v.startsWith('uploads/')) return `/${v}`;
  return v;
}

function extractImageLikeValues(node, result = []) {
  if (Array.isArray(node)) {
    node.forEach((item) => extractImageLikeValues(item, result));
    return result;
  }

  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const keyName = key.toLowerCase();
        if (
          keyName.includes('image') ||
          keyName.includes('logo') ||
          keyName.includes('banner') ||
          keyName.includes('avatar') ||
          keyName.includes('thumbnail') ||
          keyName.includes('icon')
        ) {
          if (looksLikeImageUrl(value)) result.push(normalizeAssetUrl(value));
        }
      } else {
        extractImageLikeValues(value, result);
      }
    });
  }

  return result;
}

function collectNonProductAssetUrls(usersData, notificationsData) {
  const urls = [];

  const staticJsonFiles = listJsonFiles(CLIENT_STATIC_DIR);
  staticJsonFiles.forEach((filePath) => {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    extractImageLikeValues(json, urls);
  });

  const testDataJsonFiles = listJsonFiles(CLIENT_TESTDATA_DIR);
  testDataJsonFiles.forEach((filePath) => {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    extractImageLikeValues(json, urls);
  });

  usersData.forEach((user) => {
    if (looksLikeImageUrl(user.avatar)) urls.push(normalizeAssetUrl(user.avatar));
  });

  notificationsData.forEach((notification) => {
    if (looksLikeImageUrl(notification.image)) urls.push(normalizeAssetUrl(notification.image));
  });

  return Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean)));
}

function buildAssetDocs(assetUrls, now) {
  return assetUrls.map((url) => {
    const digest = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
    const ext = path.extname(url).replace('.', '').toLowerCase();
    const normalizedExt = ext || 'bin';
    const mimeType = normalizedExt === 'jpg' || normalizedExt === 'jpeg'
      ? 'image/jpeg'
      : normalizedExt === 'png'
      ? 'image/png'
      : normalizedExt === 'webp'
      ? 'image/webp'
      : normalizedExt === 'svg'
      ? 'image/svg+xml'
      : 'application/octet-stream';
    const isLocalUpload = url.startsWith('/uploads/');
    const fileName = path.basename(url);

    return {
      storageKey: isLocalUpload ? `uploads/${fileName || `${digest}.${normalizedExt}`}` : `seed/assets/${digest}.${normalizedExt}`,
      cdnUrl: url,
      sourceType: isLocalUpload ? 'local_upload' : 'external',
      local: isLocalUpload
        ? {
            publicUrl: url,
            diskPath: path.join('server', 'uploads', fileName || `${digest}.${normalizedExt}`),
            fileName: fileName || `${digest}.${normalizedExt}`,
          }
        : undefined,
      mimeType,
      size: 0,
      variants: {},
      width: 0,
      height: 0,
      alt: { en: '', ar: '' },
      audit: { createdAt: now, updatedAt: now },
    };
  });
}

function parseProductsData() {
  const source = readFile('products.ts');
  const rawProducts = evalLiteral(extractLiteral(source, 'rawProducts'));
  const offersDatabase = evalLiteral(extractLiteral(source, 'offersDatabase'));
  return { rawProducts, offersDatabase };
}

function parseUsersData() {
  const source = readFile('usersData.ts');
  return evalLiteral(extractLiteral(source, 'usersData'));
}

function parseOrdersData() {
  const source = readFile('ordersData.ts');
  return evalLiteral(extractLiteral(source, 'ordersData'));
}

function parseNotificationsData() {
  const source = readFile('notificationsData.ts');
  return evalLiteral(extractLiteral(source, 'notificationsData'));
}

function parseAnalyticsData() {
  const source = readFile('analyticsData.ts');
  return {
    visitorSessions: evalLiteral(extractLiteral(source, 'visitorSessions')),
    cartEvents: evalLiteral(extractLiteral(source, 'cartEvents')),
    adminActions: evalLiteral(extractLiteral(source, 'adminActions')),
  };
}

function parseSavedSpecsData() {
  const source = readFile('savedSpecTitlesData.ts');
  return evalLiteral(extractLiteral(source, 'savedSpecTitles'));
}

function parseServicesData() {
  const source = readFile('servicesData.ts');
  return {
    servicesData: evalLiteral(extractLiteral(source, 'servicesData')),
    maintenanceRecords: evalLiteral(extractLiteral(source, 'maintenanceRecords')),
    warrantyRecords: evalLiteral(extractLiteral(source, 'warrantyRecords')),
    paymentCompanies: evalLiteral(extractLiteral(source, 'paymentCompanies')),
  };
}

function parseStaticCategoryBrandData() {
  const categoriesStatic = readStaticJson('categories.json');
  const brandsStatic = readStaticJson('brands.json');
  return { categoriesStatic, brandsStatic };
}

async function replaceCollection(db, name, docs) {
  const col = db.collection(name);
  await col.deleteMany({});
  if (docs.length > 0) {
    await col.insertMany(docs, { ordered: false });
  }
  return docs.length;
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);

  try {
    const { rawProducts, offersDatabase } = parseProductsData();
    const usersData = parseUsersData();
    const ordersData = parseOrdersData();
    const notificationsData = parseNotificationsData();
    const { visitorSessions, cartEvents, adminActions } = parseAnalyticsData();
    const savedSpecTitles = parseSavedSpecsData();
    const { servicesData, maintenanceRecords, warrantyRecords, paymentCompanies } = parseServicesData();
    const { categoriesStatic, brandsStatic } = parseStaticCategoryBrandData();

    const now = new Date();
    const assetUrls = collectNonProductAssetUrls(usersData, notificationsData);
    const assetDocs = buildAssetDocs(assetUrls, now);

    await replaceCollection(db, 'assets', assetDocs);

    const categories = (categoriesStatic || []).map((cat, idx) => ({
      cat_code: String(cat.cat_code),
      slug: toSlug(cat.nameEn || cat.name || `category-${idx}`),
      name: { en: cat.nameEn || cat.name || '', ar: cat.name || cat.nameEn || '' },
      iconName: cat.iconName || 'Package',
      sortOrder: idx + 1,
      isActive: true,
      audit: { createdAt: now, updatedAt: now },
    }));

    const brandsByCode = new Map();
    (brandsStatic || []).forEach((brand, idx) => {
      const code = String(brand.brand_code);
      const catCode = String(brand.category_code || '');
      if (!brandsByCode.has(code)) {
        brandsByCode.set(code, {
          brand_code: code,
          slug: toSlug(brand.englishName || brand.name || `brand-${idx}`),
          name: { en: brand.englishName || brand.name || '', ar: brand.name || brand.englishName || '' },
          image: brand.image || '',
          cat_code: catCode || null,
          cat_codes: catCode ? [catCode] : [],
          isActive: true,
          sortOrder: idx + 1,
          audit: { createdAt: now, updatedAt: now },
        });
      } else if (catCode) {
        const current = brandsByCode.get(code);
        if (!current.cat_codes.includes(catCode)) current.cat_codes.push(catCode);
        if (!current.cat_code) current.cat_code = catCode;
      }
    });
    const brands = Array.from(brandsByCode.values());

    await replaceCollection(db, 'categories', categories);
    const insertedCategories = await db.collection('categories').find({}).toArray();
    const categoryIdBySlug = new Map(insertedCategories.map((c) => [String(c.slug || ''), c._id]));
    const categoryIdByCode = new Map(insertedCategories.map((c) => [String(c.cat_code || ''), c._id]));
    const categoryCodeBySlug = new Map(insertedCategories.map((c) => [String(c.slug || ''), String(c.cat_code || '')]));
    const categoryCodeByName = new Map();
    insertedCategories.forEach((c) => {
      if (c?.name?.en) categoryCodeByName.set(toSlug(c.name.en), String(c.cat_code));
      if (c?.name?.ar) categoryCodeByName.set(toSlug(c.name.ar), String(c.cat_code));
    });

    const brandsWithCategoryIds = brands.map((b) => ({
      ...b,
      categoryIds: (b.cat_codes || []).map((code) => categoryIdByCode.get(String(code))).filter(Boolean),
    }));
    await replaceCollection(db, 'brands', brandsWithCategoryIds);
    const insertedBrands = await db.collection('brands').find({}).toArray();
    const brandIdBySlug = new Map(insertedBrands.map((b) => [String(b.slug || ''), b._id]));
    const brandIdByCode = new Map(insertedBrands.map((b) => [String(b.brand_code || ''), b._id]));
    const brandCodeByName = new Map();
    insertedBrands.forEach((b) => {
      if (b?.name?.en) brandCodeByName.set(toSlug(b.name.en), String(b.brand_code));
      if (b?.name?.ar) brandCodeByName.set(toSlug(b.name.ar), String(b.brand_code));
      if (b?.slug) brandCodeByName.set(String(b.slug), String(b.brand_code));
    });

    const products = rawProducts.map((product, idx) => {
      const categorySlug = toSlug(product.category || `category-${idx}`);
      const brandSlug = toSlug(product.brand || `brand-${idx}`);
      const brandTokens = String(product.brand || '')
        .split(/[/,&+]| and /i)
        .map((part) => toSlug(part))
        .filter(Boolean);
      const brandCodes = Array.from(new Set(brandTokens.map((token) => brandCodeByName.get(token)).filter(Boolean)));
      const primaryBrandCode = brandCodes[0] || brandCodeByName.get(brandSlug) || null;
      if (primaryBrandCode && brandCodes.length === 0) brandCodes.push(primaryBrandCode);

      const catFromName = categoryCodeByName.get(toSlug(product.category)) || categoryCodeBySlug.get(categorySlug) || null;
      const catFromBrand = primaryBrandCode ? insertedBrands.find((b) => String(b.brand_code) === String(primaryBrandCode))?.cat_code : null;
      const catCodes = Array.from(new Set([catFromName, catFromBrand].filter(Boolean).map(String)));
      const primaryCatCode = catCodes[0] || null;
      const hasColorVariants = Array.isArray(product.colorVariants) && product.colorVariants.length > 0;
      const normalizedVariants = (product.colorVariants || []).map((variant) => {
        const isAvailable = typeof variant.isAvailable === 'boolean'
          ? variant.isAvailable
          : typeof variant.inStock === 'boolean'
          ? variant.inStock
          : Number(variant.stock || 0) > 0;
        return { ...variant, isAvailable, inStock: isAvailable };
      });

      const productAvailable = hasColorVariants
        ? normalizedVariants.some((variant) => variant.isAvailable)
        : true;

      return {
        ...product,
        stk_code: product.sku || `STK-${String(product.id || idx + 1).padStart(6, '0')}`,
        cat_code: primaryCatCode,
        cat_codes: catCodes,
        brand_code: primaryBrandCode,
        brand_codes: brandCodes,
        categoryIds: catCodes.map((code) => categoryIdByCode.get(String(code))).filter(Boolean),
        brandId: primaryBrandCode ? (brandIdByCode.get(String(primaryBrandCode)) || brandIdBySlug.get(brandSlug) || null) : (brandIdBySlug.get(brandSlug) || null),
        availability: {
          isAvailable: productAvailable,
          hiddenReason: productAvailable ? null : 'out_of_stock',
          lastSyncedAt: now,
        },
        colorVariants: normalizedVariants,
        status: {
          isActive: true,
          isHidden: !productAvailable,
        },
        audit: { createdAt: now, updatedAt: now },
        updatedAt: now,
      };
    });
    await replaceCollection(db, 'products', products);

    const offerDocs = [];
    offersDatabase.forEach((entry) => {
      (entry.offers || []).forEach((offer, idx) => {
        offerDocs.push({
          offer_no: `${offer.type}-${entry.productId}-${idx + 1}`,
          offer_type: offer.type,
          mainproductstk_code: String(entry.productId),
          discount:
            offer.type === 'direct_discount'
              ? offer.discountValue
              : offer.type === 'coupon'
              ? offer.couponValue
              : offer.type === 'bundle_discount'
              ? offer.discountPercentage
              : 0,
          discount_type:
            offer.type === 'direct_discount' && offer.discountType === 'percentage'
              ? 'p'
              : offer.type === 'bundle_discount'
              ? 'p'
              : 'v',
          title: offer.titleEn,
          title_ar: offer.titleAr,
          description: offer.descriptionEn,
          description_ar: offer.descriptionAr,
          products: (offer.eligibleProductIds || offer.relatedProductIds || [])
            .map((id) => String(id))
            .filter(Boolean),
          start: new Date('2024-01-01T00:00:00.000Z'),
          end: new Date('2030-12-31T23:59:59.999Z'),
          is_active: true,
          createdAt: now,
        });
      });
    });
    await replaceCollection(db, 'offers', offerDocs);

    const allCategoryIds = insertedCategories.map((c) => c._id);
    const allBrandIds = insertedBrands.map((b) => b._id);

    const users = usersData.map((user) => {
      const categoriesAllowed = user.privileges?.categories?.allowedCategories || [];
      const brandsAllowed = user.privileges?.brands?.allowedBrands || [];
      return {
        email: user.email,
        username: user.email.split('@')[0],
        name: { full: user.name, fullAr: user.nameAr },
        phone: user.phone,
        role: user.role,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        status: user.status,
        registeredAt: user.registeredAt ? new Date(user.registeredAt) : now,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : now,
        stats: {
          totalOrders: user.totalOrders || 0,
          totalSpent: user.totalSpent || 0,
          lastLoginAt: user.lastLogin ? new Date(user.lastLogin) : now,
        },
        adminMeta: {
          level: user.adminLevel === 'lead' ? 3 : user.adminLevel === 'senior' ? 2 : 1,
          isSuspended: user.status === 'suspended' || user.status === 'banned',
          allowAllCategories: categoriesAllowed.includes('all') || user.role === 'super_admin',
          allowAllBrands: brandsAllowed.includes('all') || user.role === 'super_admin',
          // use codes instead of internal ObjectIds
          allowedCategoryIds: categoriesAllowed.includes('all')
            ? insertedCategories.map((c) => String(c.cat_code))
            : categoriesAllowed
                .map((slug) => categoryCodeBySlug.get(toSlug(slug)))
                .filter(Boolean),
          allowedBrandIds: brandsAllowed.includes('all')
            ? insertedBrands.map((b) => String(b.brand_code))
            : brandsAllowed
                .map((slug) => brandCodeByName.get(toSlug(slug)))
                .filter(Boolean),
        },
      };
    });

    users.push({
      email: 'yaseen@mabco.local',
      username: 'yaseen',
      role: 'super_admin',
      isAdmin: true,
      isSuperAdmin: true,
      name: { full: 'Yaseen', fullAr: 'ياسين' },
      passwordHash: hashPassword('y@$een10'),
      status: 'active',
      registeredAt: now,
      lastLogin: now,
      stats: { totalOrders: 0, totalSpent: 0, lastLoginAt: now },
      adminMeta: {
        level: 3,
        isSuspended: false,
        allowAllCategories: true,
        allowAllBrands: true,
        allowedCategoryIds: insertedCategories.map((c) => String(c.cat_code)),
        allowedBrandIds: insertedBrands.map((b) => String(b.brand_code)),
      },
    });

    users.push({
      email: 'cord1@mabco.local',
      username: 'cord1',
      role: 'admin',
      isAdmin: true,
      isSuperAdmin: false,
      name: { full: 'cord1', fullAr: 'كورد1' },
      passwordHash: hashPassword('Mabco123'),
      status: 'active',
      registeredAt: now,
      lastLogin: now,
      stats: { totalOrders: 0, totalSpent: 0, lastLoginAt: now },
      adminMeta: {
        level: 2,
        isSuspended: false,
        allowAllCategories: true,
        allowAllBrands: true,
        allowedCategoryIds: insertedCategories.map((c) => String(c.cat_code)),
        allowedBrandIds: insertedBrands.map((b) => String(b.brand_code)),
      },
    });

    await replaceCollection(db, 'users', users);

    const orders = ordersData.map((order) => ({
      orderNumber: order.orderNumber || order.id,
      externalId: order.id,
      userRef: order.customer?.id || null,
      customerSnapshot: order.customer || {},
      items: (order.items || []).map((item) => ({
        productId: item.id,
        name: item.name,
        nameAr: item.nameAr,
        qty: Math.min(2, Math.max(1, Number(item.quantity || 1))),
        price: Number(item.price || 0),
        color: item.color || null,
        specs: item.specs || null,
      })),
      pricing: order.pricing || {},
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      statusHistory: order.timeline || [],
      orderDate: new Date(order.orderDate),
      createdAt: new Date(order.orderDate),
      updatedAt: now,
    }));
    await replaceCollection(db, 'orders', orders);

    const notifications = notificationsData.map((n) => ({
      ...n,
      createdAt: n.createdAt ? new Date(n.createdAt) : now,
      updatedAt: now,
    }));
    await replaceCollection(db, 'notifications', notifications);

    const webEvents = visitorSessions.map((s) => ({
      eventAt: s.timestamp ? new Date(s.timestamp) : now,
      eventType: s.eventType || 'page_view',
      path: s.page || s.path || '/',
      referrer: s.referrer || '',
      deviceType: s.deviceType || '',
      browser: s.browser || '',
      country: s.country || '',
      city: s.city || '',
      meta: {
        sessionId: s.sessionId || '',
        userId: s.userId || null,
        deviceType: s.deviceType || '',
        country: s.country || '',
      },
      metadata: s,
    }));
    await replaceCollection(db, 'web_events', webEvents);

    const cartEventDocs = cartEvents.map((e) => ({
      eventAt: e.timestamp ? new Date(e.timestamp) : now,
      action: e.action || 'added',
      cartId: e.cartId || null,
      orderId: e.orderId || null,
      qty: Number(e.quantity || 1),
      priceSnapshot: Number(e.price || 0),
      meta: {
        userId: e.userId || null,
        productId: e.productId || null,
        sessionId: e.sessionId || null,
      },
    }));
    await replaceCollection(db, 'cart_events', cartEventDocs);

    const adminActionDocs = adminActions.map((a) => ({
      actorUserId: null,
      actorRole: a.adminName ? 'admin' : 'system',
      actionType: a.actionType || 'update',
      targetType: a.targetType || 'product',
      targetId: null,
      targetNameSnapshot: a.targetName || '',
      changes: a.changes || [],
      status: a.status || 'success',
      note: a.notes || '',
      createdAt: a.timestamp ? new Date(a.timestamp) : now,
      requestMeta: {
        ip: a.ipAddress || '',
        userAgent: a.userAgent || '',
      },
      metadata: a,
    }));
    await replaceCollection(db, 'admin_actions', adminActionDocs);

    const savedSpecs = savedSpecTitles.map((s) => ({
      name: { en: s.nameEn, ar: s.nameAr },
      icon: s.icon,
      usageCount: Number(s.usageCount || 0),
      category: s.category || null,
      nameEnNormalized: toSlug(s.nameEn).replace(/-/g, ''),
      status: { isActive: true },
      audit: { createdAt: now, updatedAt: now },
    }));
    await replaceCollection(db, 'saved_spec_titles', savedSpecs);

    const serviceRequests = servicesData.map((svc) => ({
      type: svc.path || 'other',
      userId: null,
      payload: {
        nameEn: svc.nameEn,
        nameAr: svc.nameAr,
        descriptionEn: svc.descriptionEn,
        descriptionAr: svc.descriptionAr,
      },
      status: 'open',
      createdAt: now,
      updatedAt: now,
    }));
    await replaceCollection(db, 'service_requests', serviceRequests);

    const maintenanceTickets = maintenanceRecords.map((m) => ({
      ticketNumber: m.ticketNumber || m.id || `MT-${Math.random().toString(36).slice(2, 8)}`,
      serialNumber: m.serialNumber || '',
      userId: null,
      productSnapshot: { name: m.deviceName || '', brand: m.brand || '' },
      statusCode: Number(m.statusCode || 1),
      statusLabel: m.statusText || '',
      timeline: m.timeline || [],
      receivedAt: m.createdAt ? new Date(m.createdAt) : now,
      eta: m.estimatedCompletion ? new Date(m.estimatedCompletion) : null,
      closedAt: null,
      updatedAt: now,
    }));
    await replaceCollection(db, 'maintenance_tickets', maintenanceTickets);

    const warrantyDocs = warrantyRecords.map((w) => ({
      serialNumber: w.serialNumber || `W-${Math.random().toString(36).slice(2, 8)}`,
      imei: w.imei || null,
      userId: null,
      productId: null,
      purchaseOrderId: null,
      coverageType: w.warrantyType || 'standard',
      startsAt: w.startDate ? new Date(w.startDate) : now,
      endsAt: w.endDate ? new Date(w.endDate) : now,
      claimsUsed: Number(w.claimsUsed || 0),
      maxClaims: Number(w.maxClaims || 0),
      isActive: w.isActive !== false,
    }));
    await replaceCollection(db, 'warranties', warrantyDocs);

    const paymentTransactions = paymentCompanies.map((p, idx) => ({
      transactionId: `seed-pay-${idx + 1}-${toSlug(p.nameEn || p.nameAr || 'company')}`,
      provider: p.nameEn || p.nameAr || 'provider',
      serviceType: 'epayment',
      accountRef: p.accountNumber || '',
      amount: 0,
      status: 'configured',
      requestedBy: null,
      createdAt: now,
      settledAt: null,
    }));
    await replaceCollection(db, 'payment_transactions', paymentTransactions);

    const siteContent = [
      {
        key: 'services_catalog',
        locale: 'en',
        content: servicesData.map((s) => ({
          id: s.id,
          name: s.nameEn,
          description: s.descriptionEn,
          path: s.path,
          icon: s.icon,
        })),
      },
      {
        key: 'services_catalog',
        locale: 'ar',
        content: servicesData.map((s) => ({
          id: s.id,
          name: s.nameAr,
          description: s.descriptionAr,
          path: s.path,
          icon: s.icon,
        })),
      },
    ];
    await replaceCollection(db, 'site_content', siteContent);

    console.log('Seed completed successfully.');
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
