const sql = require('mssql');

function parseConnString(value) {
  const parts = String(value || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  const cfg = {};
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim().toLowerCase();
    const val = part.slice(idx + 1).trim();
    cfg[key] = val;
  }
  return cfg;
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'object' && value.$date) {
    const d = new Date(value.$date);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function normalizeOffer(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const start =
    toDate(raw.start) ||
    toDate(raw.startsAt) ||
    toDate(raw.window?.start) ||
    toDate(raw.window?.startsAt);
  const end =
    toDate(raw.end) ||
    toDate(raw.endsAt) ||
    toDate(raw.window?.end) ||
    toDate(raw.window?.endsAt);

  const offerType = raw.offer_type || raw.type;
  const offerNo = raw.offer_no != null ? String(raw.offer_no) : '';
  const discountTypeRaw = String(raw.discount_type || raw.discountType || '').toLowerCase();
  const discountType = discountTypeRaw === 'p' || discountTypeRaw === 'percentage' ? 'p' : 'v';
  const isActiveRaw = raw.is_active ?? raw.isActive ?? raw.active;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : String(isActiveRaw || '').toUpperCase() === 'Y';

  let products = [];
  if (Array.isArray(raw.products)) {
    products = raw.products
      .map((item) => (typeof item === 'string' ? item : item?.stk_code || item?.id || ''))
      .filter(Boolean)
      .map((item) => String(item));
  } else if (Array.isArray(raw.eligibleProductIds)) {
    products = raw.eligibleProductIds.map((item) => String(item));
  } else if (Array.isArray(raw.relatedProductIds)) {
    products = raw.relatedProductIds.map((item) => String(item));
  }

  const normalized = {
    offer_no: offerNo,
    offer_type: offerType,
    discount: Number(
      raw.discount ?? raw.discountValue ?? raw.couponValue ?? raw.discountPercentage ?? 0
    ),
    discount_type: discountType,
    title: raw.title || raw.titleEn || '',
    title_ar: raw.title_ar || raw.titleAr || '',
    description: raw.description || raw.descriptionEn || '',
    description_ar: raw.description_ar || raw.descriptionAr || '',
    products,
    start,
    end,
    is_active: isActive,
  };

  if (raw.mainproductstk_code) {
    normalized.mainproductstk_code = String(raw.mainproductstk_code);
  }

  if (!normalized.offer_type || !normalized.offer_no || !normalized.start || !normalized.end) {
    return null;
  }

  return normalized;
}

function normalizeColorVariants(variants = []) {
  if (!Array.isArray(variants)) return [];
  return variants.map((variant) => {
    const images = Array.isArray(variant.images)
      ? variant.images
          .map((img) => (typeof img === 'string' ? img : img?.image_link || img?.url || ''))
          .filter(Boolean)
      : [];

    return {
      stk_code: variant.stk_code ? String(variant.stk_code) : '',
      price: Number(variant.price ?? 0),
      color_name: variant.color_name || variant.name || '',
      color_name_ar: variant.color_name_ar || variant.nameAr || '',
      color_hex: variant.color_hex || variant.hex || variant.hexCode || '',
      in_stock:
        typeof variant.in_stock === 'boolean'
          ? variant.in_stock
          : Boolean(variant.is_available ?? variant.isAvailable ?? variant.inStock),
      active:
        typeof variant.active === 'boolean'
          ? variant.active
          : Boolean(variant.is_available ?? variant.isAvailable ?? true),
      images,
      offers: Array.isArray(variant.offers)
        ? variant.offers.map(normalizeOffer).filter(Boolean)
        : [],
    };
  });
}

function normalizeChargeOptions(options = []) {
  if (!Array.isArray(options)) return [];
  return options.map((opt) => ({
    stk_code: opt.stk_code ? String(opt.stk_code) : '',
    price: Number(opt.price ?? 0),
    name: opt.name || opt.value || '',
    name_ar: opt.name_ar || opt.valueAr || '',
    in_stock: typeof opt.in_stock === 'boolean' ? opt.in_stock : true,
    active: typeof opt.active === 'boolean' ? opt.active : true,
    offers: Array.isArray(opt.offers) ? opt.offers.map(normalizeOffer).filter(Boolean) : [],
  }));
}

function normalizeProductDoc(doc, stkCode, now) {
  if (!doc || typeof doc !== 'object') return null;

  const updates = { stk_code: stkCode, updatedAt: now };
  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(doc, key);

  if (hasOwn('id') && doc.id) updates.id = doc.id;
  if (!hasOwn('id') && doc.stk_code) updates.id = doc.stk_code;
  if (hasOwn('slug') && doc.slug) updates.slug = doc.slug;

  const pick = (...keys) => {
    for (const key of keys) {
      if (hasOwn(key) && doc[key] !== undefined) return doc[key];
    }
    return undefined;
  };

  const name = pick('name', 'nameEn', 'title', 'nameAr');
  if (name !== undefined) updates.name = name;
  const nameAr = pick('nameAr', 'name');
  if (nameAr !== undefined) updates.nameAr = nameAr;

  const description = pick('description', 'descriptionEn');
  if (description !== undefined) updates.description = description;
  const descriptionAr = pick('descriptionAr', 'descriptionEn', 'description');
  if (descriptionAr !== undefined) updates.descriptionAr = descriptionAr;

  const category = pick('category', 'categoryEn', 'categoryAr');
  if (category !== undefined) updates.category = category;
  const categoryAr = pick('categoryAr', 'category');
  if (categoryAr !== undefined) updates.categoryAr = categoryAr;
  const catCode = pick('cat_code', 'category_code', 'catCode');
  if (catCode !== undefined) updates.cat_code = catCode;

  const brand = pick('brand', 'brandEn', 'brandAr');
  if (brand !== undefined) updates.brand = brand;
  const brandAr = pick('brandAr', 'brand');
  if (brandAr !== undefined) updates.brandAr = brandAr;
  const brandCode = pick('brand_code', 'brandCode');
  if (brandCode !== undefined) updates.brand_code = brandCode;

  if (hasOwn('price')) updates.price = Number(doc.price ?? 0);
  if (hasOwn('images')) updates.images = Array.isArray(doc.images) ? doc.images : [];
  if (hasOwn('specs')) updates.specs = Array.isArray(doc.specs) ? doc.specs : [];
  if (hasOwn('inTheBox')) updates.inTheBox = Array.isArray(doc.inTheBox) ? doc.inTheBox : [];
  if (hasOwn('variants')) updates.variants = Array.isArray(doc.variants) ? doc.variants : [];
  if (hasOwn('colorVariants')) updates.colorVariants = normalizeColorVariants(doc.colorVariants || []);
  if (hasOwn('chargeOptions')) updates.chargeOptions = normalizeChargeOptions(doc.chargeOptions || []);
  if (hasOwn('offers')) {
    updates.offers = Array.isArray(doc.offers) ? doc.offers.map(normalizeOffer).filter(Boolean) : [];
  }

  if (doc.audit) {
    const createdAt = toDate(doc.audit.createdAt);
    const updatedAt = toDate(doc.audit.updatedAt);
    updates.audit = {
      ...(doc.audit || {}),
      ...(createdAt ? { createdAt } : {}),
      ...(updatedAt ? { updatedAt } : {}),
    };
  }

  if (doc.availability) {
    const lastSyncedAt = toDate(doc.availability.lastSyncedAt);
    updates.availability = {
      ...(doc.availability || {}),
      ...(lastSyncedAt ? { lastSyncedAt } : {}),
    };
  }

  if (doc.status) {
    updates.status = { ...(doc.status || {}) };
  }

  return updates;
}

function pickJsonField(row) {
  const jsonField =
    row.json ||
    row.JSON ||
    row.data ||
    row.DATA ||
    row.payload ||
    row.PAYLOAD ||
    row.product_json ||
    row.PRODUCT_JSON;

  if (typeof jsonField === 'string') return jsonField;

  return (
    Object.values(row).find((value) => typeof value === 'string' && value.trim().startsWith('{')) ||
    ''
  );
}

function parseJsonPayload(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf('{');
    const last = trimmed.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      const slice = trimmed.slice(first, last + 1);
      try {
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
  }
  return null;
}

async function fetchPosRows(connString) {
  const parsed = parseConnString(connString);
  const pool = await sql.connect({
    server: parsed['data source'] || parsed['server'],
    database: parsed['initial catalog'] || parsed['database'],
    user: parsed['user id'] || parsed['user'],
    password: parsed['password'],
    port: parsed['port'] ? Number(parsed['port']) : 1433,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  });

  const result = await pool.request().query('select * from mabco_Website.dbo.GetAllProductsJson()');
  return result?.recordset || [];
}

async function syncPosProducts({ connString, db, logger = console }) {
  const now = new Date();
  const rows = await fetchPosRows(connString);

  let parsedCount = 0;
  let skipped = 0;
  const errors = [];

  for (const row of rows) {
    const stkCode = String(
      row.stk_code || row.STK_CODE || row.stock_code || row.StockCode || ''
    ).trim();
    if (!stkCode) {
      skipped += 1;
      continue;
    }

    const jsonString = pickJsonField(row);
    if (!jsonString) {
      skipped += 1;
      continue;
    }

    try {
      const parsed = parseJsonPayload(jsonString);
      if (!parsed) {
        skipped += 1;
        continue;
      }
      const updates = normalizeProductDoc(parsed, stkCode, now);
      if (!updates) {
        skipped += 1;
        continue;
      }

      const existing = await db.collection('products').findOne({ stk_code: stkCode });
      if (!existing) {
        const requiredMissing = !updates.name || !updates.nameAr || !updates.price;
        if (requiredMissing) {
          errors.push({
            stk_code: stkCode,
            error: 'Missing required fields for insert',
          });
          logger.error('[POS Sync] error', {
            stk_code: stkCode,
            error: 'Missing required fields for insert',
          });
          continue;
        }
      }

      if (existing && Array.isArray(updates.colorVariants)) {
        const existingVariants = Array.isArray(existing.colorVariants) ? existing.colorVariants : [];
        const byCode = new Map(
          updates.colorVariants
            .filter((v) => v && (v.stk_code || v.stkCode))
            .map((v) => [String(v.stk_code || v.stkCode), v]),
        );
        updates.colorVariants = existingVariants.map((variant) => {
          const code = String(variant?.stk_code || variant?.stkCode || '');
          if (!code || !byCode.has(code)) return variant;
          const incoming = byCode.get(code);
          const next = { ...variant };
          if (incoming.active !== undefined) next.active = incoming.active;
          if (incoming.images !== undefined) next.images = incoming.images;
          if (incoming.image !== undefined) next.image = incoming.image;
          if (incoming.price !== undefined) next.price = incoming.price;
          if (incoming.color_name !== undefined) next.color_name = incoming.color_name;
          if (incoming.color_name_ar !== undefined) next.color_name_ar = incoming.color_name_ar;
          if (incoming.color_hex !== undefined) next.color_hex = incoming.color_hex;
          return next;
        });
      }

      if (existing && Array.isArray(updates.chargeOptions)) {
        const existingOptions = Array.isArray(existing.chargeOptions) ? existing.chargeOptions : [];
        const byCode = new Map(
          updates.chargeOptions
            .filter((o) => o && (o.stk_code || o.stkCode))
            .map((o) => [String(o.stk_code || o.stkCode), o]),
        );
        updates.chargeOptions = existingOptions.map((opt) => {
          const code = String(opt?.stk_code || opt?.stkCode || '');
          if (!code || !byCode.has(code)) return opt;
          const incoming = byCode.get(code);
          const next = { ...opt };
          if (incoming.active !== undefined) next.active = incoming.active;
          if (incoming.in_stock !== undefined) next.in_stock = incoming.in_stock;
          if (incoming.price !== undefined) next.price = incoming.price;
          if (incoming.name !== undefined) next.name = incoming.name;
          if (incoming.name_ar !== undefined) next.name_ar = incoming.name_ar;
          return next;
        });
      }

      const result = await db.collection('products').updateOne(
        { stk_code: stkCode },
        {
          $set: updates,
          $setOnInsert: { createdAt: now },
        },
        { upsert: true },
      );

      parsedCount += 1;
      logger.log('[POS Sync] upsert', {
        stk_code: stkCode,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId,
      });
    } catch (error) {
      errors.push({ stk_code: stkCode, error: error.message });
      logger.error('[POS Sync] error', { stk_code: stkCode, error: error.message });
    }
  }

  logger.log('[POS Sync] summary', {
    totalRows: rows.length,
    parsedCount,
    skipped,
    errorCount: errors.length,
  });

  return {
    totalRows: rows.length,
    parsedCount,
    skipped,
    errors,
  };
}

module.exports = {
  syncPosProducts,
};
