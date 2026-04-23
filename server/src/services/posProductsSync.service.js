const sql = require('mssql');
const { posSyncTimeoutMs } = require('../config/env');

const POS_SYNC_TIMEOUT_MS = posSyncTimeoutMs;

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatDateHourMinute(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

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

function parseBoolLike(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return fallback;
}

function toStringValue(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const localized =
      value.ar ??
      value.en ??
      value.nameAr ??
      value.nameEn ??
      value.name ??
      value.valueAr ??
      value.valueEn ??
      value.value;
    if (localized === undefined || localized === null) return undefined;
    return String(localized).trim();
  }
  return undefined;
}

function toFiniteNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => toStringValue(value))
    .filter(Boolean);
}

function normalizeProductImages(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((img) => {
      if (typeof img === 'string') return img.trim();
      if (img && typeof img === 'object') {
        const src = img.image_link || img.url || img.src || img.image || '';
        if (!src) return null;
        return {
          ...img,
          ...(img.image_link !== undefined ? { image_link: String(img.image_link).trim() } : {}),
          ...(img.url !== undefined ? { url: String(img.url).trim() } : {}),
          ...(img.src !== undefined ? { src: String(img.src).trim() } : {}),
          ...(img.image !== undefined ? { image: String(img.image).trim() } : {}),
        };
      }
      return null;
    })
    .filter(Boolean);
}

function normalizeAvailability(value) {
  if (!value || typeof value !== 'object') return undefined;
  const next = {};
  const isAvailable = parseBoolLike(value.isAvailable ?? value.is_available, undefined);
  const hiddenReason = toStringValue(value.hiddenReason);
  const lastSyncedAt = toDate(value.lastSyncedAt);

  if (typeof isAvailable === 'boolean') next.isAvailable = isAvailable;
  if (hiddenReason) next.hiddenReason = hiddenReason;
  if (lastSyncedAt) next.lastSyncedAt = lastSyncedAt;

  return Object.keys(next).length > 0 ? next : undefined;
}

function normalizeStatus(value, fallback = {}) {
  if (!value || typeof value !== 'object') return undefined;
  const next = {};
  const fallbackIsActive = parseBoolLike(fallback.isActive, undefined);
  const fallbackIsHidden = parseBoolLike(fallback.isHidden, undefined);

  if (value.isActive !== undefined || fallback.isActive !== undefined) {
    next.isActive = parseBoolLike(value.isActive, fallbackIsActive);
  }
  if (value.isHidden !== undefined || fallback.isHidden !== undefined) {
    next.isHidden = parseBoolLike(value.isHidden, fallbackIsHidden);
  }
  if (typeof next.isActive !== 'boolean' || typeof next.isHidden !== 'boolean') {
    return undefined;
  }
  return next;
}

function normalizeAudit(value, now, fallback = {}) {
  if (!value || typeof value !== 'object') return undefined;
  const createdAt = toDate(value.createdAt) || toDate(fallback.createdAt) || now;
  const updatedAt = toDate(value.updatedAt) || toDate(fallback.updatedAt) || now;
  return { createdAt, updatedAt };
}

function buildValidationRepairUpdates(existing, now) {
  if (!existing || typeof existing !== 'object') return {};

  const repair = {};
  const normalizedImages = normalizeProductImages(existing.images);
  if (Array.isArray(existing.images) && normalizedImages.length !== existing.images.length) {
    repair.images = normalizedImages;
  }

  if (Array.isArray(existing.colorVariants)) {
    repair.colorVariants = normalizeColorVariants(existing.colorVariants).filter(
      (variant) => variant?.stk_code && variant?.price !== undefined,
    );
  }

  if (Array.isArray(existing.chargeOptions)) {
    repair.chargeOptions = normalizeChargeOptions(existing.chargeOptions).filter(
      (opt) => opt?.stk_code && opt?.price !== undefined,
    );
  }

  const normalizedAvailability = normalizeAvailability(existing.availability);
  if (existing.availability) {
    repair.availability = normalizedAvailability || {};
  }

  const normalizedStatus = normalizeStatus(existing.status, {
    isActive: true,
    isHidden: false,
  });
  if (existing.status) {
    repair.status = normalizedStatus || { isActive: true, isHidden: false };
  }

  const normalizedAudit = normalizeAudit(existing.audit, now, {
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
  });
  if (existing.audit) {
    repair.audit = normalizedAudit;
  }

  return repair;
}

function mergeByStkCode(existingItems = [], incomingItems = [], mergeItem) {
  const existingList = Array.isArray(existingItems) ? existingItems : [];
  const incomingList = Array.isArray(incomingItems) ? incomingItems : [];
  const incomingByCode = new Map(
    incomingList
      .filter((item) => item && (item.stk_code || item.stkCode))
      .map((item) => [String(item.stk_code || item.stkCode), item]),
  );

  const merged = existingList.map((item) => {
    const code = String(item?.stk_code || item?.stkCode || '');
    if (!code || !incomingByCode.has(code)) return item;
    const incoming = incomingByCode.get(code);
    incomingByCode.delete(code);
    return mergeItem(item, incoming);
  });

  return [...merged, ...Array.from(incomingByCode.values())];
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

    const hasPrice = Object.prototype.hasOwnProperty.call(variant, 'price');
    const priceVal =
      hasPrice && variant.price !== null && variant.price !== ''
        ? Number(variant.price)
        : undefined;
    const price = Number.isFinite(priceVal) ? priceVal : undefined;

    const next = {
      stk_code: toStringValue(variant.stk_code || variant.stkCode) || '',
      color_name: toStringValue(variant.color_name || variant.name) || '',
      color_name_ar: toStringValue(variant.color_name_ar || variant.nameAr) || '',
      color_hex: toStringValue(variant.color_hex || variant.hex || variant.hexCode) || '',
      in_stock: parseBoolLike(
        variant.in_stock ?? variant.inStock ?? variant.is_available ?? variant.isAvailable,
        true,
      ),
      active: parseBoolLike(
        variant.active ?? variant.is_active ?? variant.isActive ?? variant.is_available ?? variant.isAvailable,
        true,
      ),
      images,
      offers: Array.isArray(variant.offers)
        ? variant.offers.map(normalizeOffer).filter(Boolean)
        : [],
    };

    if (hasPrice && price !== undefined) {
      next.price = price;
    }

    return next;
  });
}

function normalizeChargeOptions(options = []) {
  if (!Array.isArray(options)) return [];
  return options.map((opt) => {
    const hasPrice = Object.prototype.hasOwnProperty.call(opt, 'price');
    const priceVal =
      hasPrice && opt.price !== null && opt.price !== ''
        ? Number(opt.price)
        : undefined;
    const price = Number.isFinite(priceVal) ? priceVal : undefined;

    const next = {
      stk_code: toStringValue(opt.stk_code || opt.stkCode) || '',
      name: toStringValue(opt.name || opt.value) || '',
      name_ar: toStringValue(opt.name_ar || opt.valueAr) || '',
      in_stock: parseBoolLike(opt.in_stock ?? opt.inStock, true),
      active: parseBoolLike(opt.active ?? opt.is_active ?? opt.isActive, true),
      offers: Array.isArray(opt.offers) ? opt.offers.map(normalizeOffer).filter(Boolean) : [],
    };

    if (hasPrice && price !== undefined) {
      next.price = price;
    }

    return next;
  });
}

function deriveAvailabilityFromVariants(colorVariants, chargeOptions) {
  const colors = Array.isArray(colorVariants) ? colorVariants : [];
  if (colors.length > 0) {
    return colors.some((variant) => variant?.active !== false && variant?.in_stock !== false);
  }

  const charges = Array.isArray(chargeOptions) ? chargeOptions : [];
  if (charges.length > 0) {
    return charges.some((opt) => opt?.active !== false && opt?.in_stock !== false);
  }

  return undefined;
}

function normalizeCode(value) {
  return String(value || '').trim();
}

function buildVariantMap(variants = []) {
  const map = new Map();
  (Array.isArray(variants) ? variants : []).forEach((variant) => {
    const code = normalizeCode(variant?.stk_code || variant?.stkCode);
    if (!code) return;
    map.set(code, variant);
  });
  return map;
}

function hasPersistedMismatch({ persistedDocs = [], expectedAvailability, expectedVariantMap }) {
  return persistedDocs.some((doc) => {
    const docAvailability = doc?.availability?.isAvailable;
    const availabilityMismatch =
      typeof expectedAvailability === 'boolean' &&
      docAvailability !== expectedAvailability;

    const docVariantMap = buildVariantMap(doc?.colorVariants);
    const variantMismatch = Array.from(expectedVariantMap.entries()).some(([code, expected]) => {
      const actual = docVariantMap.get(code);
      if (!actual) return true;
      if (expected?.in_stock !== undefined && actual?.in_stock !== expected.in_stock) return true;
      if (expected?.active !== undefined && actual?.active !== expected.active) return true;
      if (expected?.price !== undefined && Number(actual?.price) !== Number(expected.price)) return true;
      return false;
    });

    return availabilityMismatch || variantMismatch;
  });
}

function normalizeProductDoc(doc, stkCode, now) {
  if (!doc || typeof doc !== 'object') return null;

  const updates = { stk_code: stkCode, updatedAt: now };
  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(doc, key);

  if (hasOwn('id') && doc.id) updates.id = toStringValue(doc.id) || doc.id;
  if (!hasOwn('id') && doc.stk_code) updates.id = doc.stk_code;
  if (hasOwn('slug') && doc.slug) updates.slug = toStringValue(doc.slug) || doc.slug;

  const pick = (...keys) => {
    for (const key of keys) {
      if (hasOwn(key) && doc[key] !== undefined) return doc[key];
    }
    return undefined;
  };

  const name = pick('name', 'nameEn', 'title', 'nameAr');
  if (name !== undefined) updates.name = name;
  const nameAr = pick('nameAr', 'name');
  if (nameAr !== undefined) updates.nameAr = toStringValue(nameAr);

  const description = pick('description', 'descriptionEn');
  if (description !== undefined) updates.description = description;
  const descriptionAr = pick('descriptionAr', 'descriptionEn', 'description');
  if (descriptionAr !== undefined) updates.descriptionAr = toStringValue(descriptionAr);

  const category = pick('category', 'categoryEn', 'categoryAr');
  if (category !== undefined) updates.category = toStringValue(category);
  const categoryAr = pick('categoryAr', 'category');
  if (categoryAr !== undefined) updates.categoryAr = toStringValue(categoryAr);
  const catCode = pick('cat_code', 'category_code', 'catCode');
  if (catCode !== undefined) updates.cat_code = toStringValue(catCode);

  const brand = pick('brand', 'brandEn', 'brandAr');
  if (brand !== undefined) updates.brand = toStringValue(brand);
  const brandAr = pick('brandAr', 'brand');
  if (brandAr !== undefined) updates.brandAr = toStringValue(brandAr);
  const brandCode = pick('brand_code', 'brandCode');
  if (brandCode !== undefined) updates.brand_code = toStringValue(brandCode);

  if (hasOwn('price')) {
    const price = toFiniteNumber(doc.price);
    if (price !== undefined) updates.price = price;
  }
  if (hasOwn('image')) {
    const image = toStringValue(doc.image);
    if (image !== undefined) updates.image = image;
  }
  if (hasOwn('images')) updates.images = normalizeProductImages(doc.images);
  if (hasOwn('specs')) updates.specs = Array.isArray(doc.specs) ? doc.specs : [];
  if (hasOwn('inTheBox')) updates.inTheBox = Array.isArray(doc.inTheBox) ? doc.inTheBox : [];
  if (hasOwn('variants')) updates.variants = Array.isArray(doc.variants) ? doc.variants : [];
  if (hasOwn('cat_codes')) updates.cat_codes = normalizeStringArray(doc.cat_codes);
  if (hasOwn('brand_codes')) updates.brand_codes = normalizeStringArray(doc.brand_codes);
  if (hasOwn('colorVariants')) updates.colorVariants = normalizeColorVariants(doc.colorVariants || []);
  if (hasOwn('chargeOptions')) updates.chargeOptions = normalizeChargeOptions(doc.chargeOptions || []);
  if (hasOwn('offers')) {
    updates.offers = Array.isArray(doc.offers) ? doc.offers.map(normalizeOffer).filter(Boolean) : [];
  }

  if (doc.audit) updates.audit = normalizeAudit(doc.audit, now);

  if (doc.availability) updates.availability = normalizeAvailability(doc.availability);

  const derivedIsAvailable = deriveAvailabilityFromVariants(updates.colorVariants, updates.chargeOptions);
  if (derivedIsAvailable !== undefined) {
    if (!updates.availability || typeof updates.availability !== 'object') {
      updates.availability = { isAvailable: derivedIsAvailable };
    } else if (typeof updates.availability.isAvailable !== 'boolean') {
      updates.availability.isAvailable = derivedIsAvailable;
    }
  }

  if (doc.status) updates.status = normalizeStatus(doc.status);

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

function parseJsonPayload(raw, stkCode = 'unknown', logger = console) {
  if (typeof raw !== 'string') {
    logger.warn(`[parseJsonPayload] Raw is not a string for ${stkCode}:`, typeof raw, raw);
    return null;
  }
  
  const trimmed = raw.trim();
  if (!trimmed) {
    logger.warn(`[parseJsonPayload] Empty string for ${stkCode}`);
    return null;
  }
  
  logger.debug(`[parseJsonPayload] Attempting to parse for ${stkCode}, length: ${trimmed.length}, preview: ${trimmed.substring(0, 100)}`);
  
  // Check if it looks like multiple JSON objects
  if (trimmed.startsWith('{') && trimmed.includes('}{')) {
    logger.warn(`[parseJsonPayload] Detected multiple JSON objects for ${stkCode}`);
  }
  
  // Try parsing as is first
  try {
    const parsed = JSON.parse(trimmed);
    logger.debug(`[parseJsonPayload] Successfully parsed single JSON for ${stkCode}`);
    return parsed;
  } catch (e) {
    logger.warn(`[parseJsonPayload] First parse attempt failed for ${stkCode}:`, e.message);
    
    // Try to extract valid JSON by counting braces
    let depth = 0;
    let start = -1;
    let end = -1;
    
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (trimmed[i] === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          end = i;
          break; // Take the first complete JSON object
        }
      }
    }
    
    if (start !== -1 && end !== -1) {
      const extracted = trimmed.substring(start, end + 1);
      logger.debug(`[parseJsonPayload] Extracted JSON substring for ${stkCode}, length: ${extracted.length}`);
      try {
        const parsed = JSON.parse(extracted);
        logger.debug(`[parseJsonPayload] Successfully parsed extracted JSON for ${stkCode}`);
        return parsed;
      } catch (e2) {
        logger.error(`[parseJsonPayload] Failed to parse extracted JSON for ${stkCode}:`, e2.message);
        logger.error(`[parseJsonPayload] Extracted preview: ${extracted.substring(0, 200)}`);
      }
    } else {
      logger.error(`[parseJsonPayload] Could not find valid JSON structure for ${stkCode}`);
    }
  }
  
  return null;
}

async function fetchPosRows(connString) {
  const parsed = parseConnString(connString);
  const config = {
    server: parsed['data source'] || parsed.server,
    database: parsed['initial catalog'] || parsed.database,
    user: parsed['user id'] || parsed.user,
    password: parsed.password,
    port: parsed.port ? Number(parsed.port) : 1433,
    connectionTimeout: POS_SYNC_TIMEOUT_MS,
    requestTimeout: POS_SYNC_TIMEOUT_MS,
    options: {
      encrypt: parseBoolLike(parsed.encrypt, false),
      trustServerCertificate: parseBoolLike(parsed.trustservercertificate, true),
    },
  };

  const pool = new sql.ConnectionPool(config);
  try {
    await pool.connect();
    const result = await pool.request().query('select * from mabco_Website.dbo.GetAllProductsJson()');
    return result?.recordset || [];
  } finally {
    await pool.close().catch(() => {});
  }
}

async function syncPosProducts({ connString, db, logger = console, rowsOverride = null }) {
  const now = new Date();
  const syncStartedAt = new Date();
  const rows = Array.isArray(rowsOverride) ? rowsOverride : await fetchPosRows(connString);

  let parsedCount = 0;
  let skipped = 0;
  const errors = [];
  const skipReasons = {
    noStkCode: 0,
    noJsonString: 0,
    jsonParseFailed: 0,
    normalizeFailed: 0,
    other: 0
  };

  logger.log('[POS Sync] Starting sync', {
    totalRowsFromQuery: rows.length,
    source: Array.isArray(rowsOverride) ? 'request_body' : 'sql_function',
    startedAt: formatDateHourMinute(syncStartedAt),
    startedAtIso: syncStartedAt.toISOString(),
  });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Log sample of first few rows to see structure
    if (i < 3) {
      logger.log(`[POS Sync] Sample row ${i}:`, {
        keys: Object.keys(row),
        stk_code_sample: row.stk_code || row.STK_CODE || row.stock_code,
        hasJson: !!(row.json || row.JSON || row.data || row.product_json)
      });
    }

    const stkCode = String(
      row.stk_code || row.STK_CODE || row.stock_code || row.StockCode || ''
    ).trim();
    
    if (!stkCode) {
      skipped += 1;
      skipReasons.noStkCode += 1;
      logger.warn('[POS Sync] Skipped - No stk_code found', { 
        rowIndex: i,
        rowKeys: Object.keys(row),
        availableCodes: {
          stk_code: row.stk_code,
          STK_CODE: row.STK_CODE,
          stock_code: row.stock_code,
          StockCode: row.StockCode
        }
      });
      continue;
    }

    const jsonString = pickJsonField(row);
    if (!jsonString) {
      skipped += 1;
      skipReasons.noJsonString += 1;
      logger.warn('[POS Sync] Skipped - No JSON field found', { 
        stkCode,
        rowIndex: i,
        availableFields: Object.keys(row).filter(k => 
          ['json', 'JSON', 'data', 'DATA', 'payload', 'PAYLOAD', 'product_json', 'PRODUCT_JSON'].includes(k)
        ),
        allFieldNames: Object.keys(row)
      });
      continue;
    }

    logger.debug(`[POS Sync] JSON string length for ${stkCode}:`, jsonString.length);
    
    const parsed = parseJsonPayload(jsonString, stkCode, logger);
    if (!parsed) {
      skipped += 1;
      skipReasons.jsonParseFailed += 1;
      logger.warn('[POS Sync] Skipped - JSON parse failed', { 
        stkCode,
        rowIndex: i,
        jsonPreview: jsonString.substring(0, 200),
        jsonLength: jsonString.length
      });
      continue;
    }

      logger.log('[POS Sync] Incoming payload snapshot', {
        stk_code: stkCode,
        sentAvailability: parsed?.availability || null,
        sentColorVariants: Array.isArray(parsed?.colorVariants)
          ? parsed.colorVariants.map((variant) => ({
              stk_code: variant?.stk_code || variant?.stkCode || null,
              in_stock: variant?.in_stock ?? variant?.inStock ?? variant?.isAvailable ?? variant?.is_available ?? null,
              active: variant?.active ?? variant?.isActive ?? variant?.is_active ?? null,
              price: variant?.price ?? null,
              offersCount: Array.isArray(variant?.offers) ? variant.offers.length : 0,
              color_name: variant?.color_name ?? variant?.name ?? null,
              color_name_ar: variant?.color_name_ar ?? variant?.nameAr ?? null,
              color_hex: variant?.color_hex ?? variant?.hex ?? variant?.hexCode ?? null,
            }))
          : [],
      });

    const updates = normalizeProductDoc(parsed, stkCode, now);
    if (!updates) {
      skipped += 1;
      skipReasons.normalizeFailed += 1;
      logger.warn('[POS Sync] Skipped - normalizeProductDoc returned null', { 
        stkCode,
        rowIndex: i,
        parsedKeys: Object.keys(parsed),
        parsedPreview: JSON.stringify(parsed).substring(0, 200)
      });
      continue;
    }

    try {
      const existing = await db.collection('products').findOne({ stk_code: stkCode });
      const repairUpdates = buildValidationRepairUpdates(existing, now);
      const incomingUpdates = { ...updates };
      Object.assign(updates, repairUpdates, incomingUpdates);
      
      // For new documents (insert only), ensure status has required fields with defaults
      if (!existing) {
        if (!updates.status || typeof updates.status !== 'object') {
          updates.status = { isActive: true, isHidden: false };
        } else {
          if (typeof updates.status.isActive !== 'boolean') {
            updates.status.isActive = true;
          }
          if (typeof updates.status.isHidden !== 'boolean') {
            updates.status.isHidden = false;
          }
        }
      }
      
      if (!existing) {
        if (!updates.name) updates.name = `${stkCode}`;
        if (!updates.nameAr) updates.nameAr = `${stkCode}`;
        if (Array.isArray(updates.colorVariants)) {
          updates.colorVariants = updates.colorVariants.filter(
            (variant) => variant?.price !== undefined,
          );
        }
        if (Array.isArray(updates.chargeOptions)) {
          updates.chargeOptions = updates.chargeOptions.filter(
            (opt) => opt?.price !== undefined,
          );
        }
        if (updates.price === undefined) updates.price = 0;
        logger.warn('[POS Sync] Force insert mode active - bypassing required-field gate', {
          stk_code: stkCode,
          hasName: !!updates.name,
          hasNameAr: !!updates.nameAr,
          hasPrice: updates.price !== undefined,
          updatesKeys: Object.keys(updates),
        });
      }

      if (existing && Array.isArray(updates.colorVariants)) {
        const existingVariants = Array.isArray(existing.colorVariants) ? existing.colorVariants : [];
        const existingCodes = new Set(
          existingVariants
            .map((variant) => normalizeCode(variant?.stk_code || variant?.stkCode))
            .filter(Boolean),
        );
        const missingIncomingCodes = updates.colorVariants
          .map((variant) => normalizeCode(variant?.stk_code || variant?.stkCode))
          .filter((code) => code && !existingCodes.has(code));

        updates.colorVariants = normalizeColorVariants(mergeByStkCode(existingVariants, updates.colorVariants, (variant, incoming) => {
          const next = { ...variant };
          if (incoming.in_stock !== undefined) next.in_stock = incoming.in_stock;
          if (incoming.price !== undefined) next.price = incoming.price;
          // Sync POS offers at the color level.
          if (incoming.offers !== undefined) next.offers = incoming.offers;
          return next;
        }))
          .map((variant) => {
            if (variant?.price !== undefined) return variant;
            const fallbackPrice =
              updates.price !== undefined
                ? updates.price
                : existing?.price !== undefined
                ? existing.price
                : undefined;
            return fallbackPrice !== undefined ? { ...variant, price: fallbackPrice } : variant;
          })
          .filter((variant) => variant?.stk_code && variant?.price !== undefined);

        if (missingIncomingCodes.length > 0) {
          logger.log('[POS Sync] Added missing color variants by stk_code', {
            stk_code: stkCode,
            addedColorVariantCodes: missingIncomingCodes,
          });
        }
      }

      if (existing && Array.isArray(updates.chargeOptions)) {
        const existingOptions = Array.isArray(existing.chargeOptions) ? existing.chargeOptions : [];
        updates.chargeOptions = normalizeChargeOptions(mergeByStkCode(existingOptions, updates.chargeOptions, (opt, incoming) => {
          const next = { ...opt };
          if (incoming.in_stock !== undefined) next.in_stock = incoming.in_stock;
          if (incoming.price !== undefined) next.price = incoming.price;
          if (incoming.offers !== undefined) next.offers = incoming.offers;
          return next;
        })).filter((opt) => opt?.stk_code && opt?.price !== undefined);
      }

      let writeUpdates = updates;
      if (existing) {
        writeUpdates = {
          stk_code: stkCode,
          updatedAt: updates.updatedAt || now,
        };
        if (updates.price !== undefined) {
          writeUpdates.price = updates.price;
        }
        if (updates.availability && typeof updates.availability === 'object') {
          const sanitizedAvailability = {};
          if (typeof updates.availability.isAvailable === 'boolean') {
            sanitizedAvailability.isAvailable = updates.availability.isAvailable;
          }
          if (updates.availability.lastSyncedAt instanceof Date) {
            sanitizedAvailability.lastSyncedAt = updates.availability.lastSyncedAt;
          }
          if (Object.keys(sanitizedAvailability).length > 0) {
            writeUpdates.availability = sanitizedAvailability;
          }
        }
        if (Array.isArray(updates.colorVariants)) {
          writeUpdates.colorVariants = updates.colorVariants;
        }
        if (Array.isArray(updates.chargeOptions)) {
          writeUpdates.chargeOptions = updates.chargeOptions;
        }
        writeUpdates['audit.updatedAt'] = writeUpdates.updatedAt;
      }

      logger.debug('[POS Sync] Prepared updates snapshot', {
        stk_code: stkCode,
        availability: writeUpdates.availability || null,
        colorVariants: Array.isArray(writeUpdates.colorVariants)
          ? writeUpdates.colorVariants.map((variant) => ({
              stk_code: variant?.stk_code,
              in_stock: variant?.in_stock,
              active: variant?.active,
              price: variant?.price,
              offersCount: Array.isArray(variant?.offers) ? variant.offers.length : 0,
            }))
          : [],
      });

      const candidateDocs = await db.collection('products')
        .find(
          { stk_code: stkCode },
          {
            projection: {
              _id: 1,
              updatedAt: 1,
            },
          },
        )
        .sort({ updatedAt: -1, _id: -1 })
        .toArray();

      const targetDocId = candidateDocs[0]?._id || null;
      if (candidateDocs.length > 1) {
        logger.warn('[POS Sync] Duplicate product documents found for stk_code; updating latest only', {
          stk_code: stkCode,
          duplicateCount: candidateDocs.length,
          targetDocId: String(targetDocId || ''),
          duplicateDocIds: candidateDocs.map((doc) => String(doc?._id || '')),
        });
      }

      const writeQuery = targetDocId ? { _id: targetDocId } : { stk_code: stkCode };
      const writeOptions = targetDocId
        ? { upsert: false, bypassDocumentValidation: true }
        : { upsert: true, bypassDocumentValidation: true };

      const result = await db.collection('products').updateOne(
        writeQuery,
        {
          $set: writeUpdates,
          ...(targetDocId ? {} : { $setOnInsert: { createdAt: now } }),
        },
        writeOptions,
      );

      const persistedDocs = await db.collection('products')
        .find(
          { stk_code: stkCode },
          {
            projection: {
              _id: 1,
              stk_code: 1,
              updatedAt: 1,
              'availability.isAvailable': 1,
              'availability.lastSyncedAt': 1,
              colorVariants: 1,
            },
          },
        )
        .toArray();

      const expectedVariantMap = buildVariantMap(writeUpdates.colorVariants);
      const expectedAvailability = writeUpdates?.availability?.isAvailable;
      const verificationDocs = targetDocId
        ? persistedDocs.filter((doc) => String(doc?._id || '') === String(targetDocId))
        : persistedDocs;
      const hasPostWriteMismatch = hasPersistedMismatch({
        persistedDocs: verificationDocs,
        expectedAvailability,
        expectedVariantMap,
      });

      if (hasPostWriteMismatch) {
        const correctiveSet = {
          updatedAt: writeUpdates.updatedAt || now,
          ...(writeUpdates.availability && typeof writeUpdates.availability === 'object'
            ? { availability: writeUpdates.availability }
            : {}),
          ...(Array.isArray(writeUpdates.colorVariants) ? { colorVariants: writeUpdates.colorVariants } : {}),
          ...(Array.isArray(writeUpdates.chargeOptions) ? { chargeOptions: writeUpdates.chargeOptions } : {}),
          ...(writeUpdates.price !== undefined ? { price: writeUpdates.price } : {}),
          ...(writeUpdates.updatedAt ? { 'audit.updatedAt': writeUpdates.updatedAt } : {}),
        };

        await db.collection('products').updateOne(
          writeQuery,
          { $set: correctiveSet },
          { upsert: false, bypassDocumentValidation: true },
        );

        const persistedAfterCorrection = await db.collection('products')
          .find(
            { stk_code: stkCode },
            {
              projection: {
                _id: 1,
                stk_code: 1,
                updatedAt: 1,
                'availability.isAvailable': 1,
                'availability.lastSyncedAt': 1,
                colorVariants: 1,
              },
            },
          )
          .toArray();

        logger.warn('[POS Sync] Post-write mismatch detected, corrective write applied', {
          stk_code: stkCode,
          expectedAvailability,
          expectedColorVariants: Array.isArray(writeUpdates.colorVariants)
            ? writeUpdates.colorVariants.map((variant) => ({
                stk_code: variant?.stk_code,
                in_stock: variant?.in_stock,
                active: variant?.active,
                price: variant?.price,
              }))
            : [],
        });

        const mismatchStillExists = hasPersistedMismatch({
          persistedDocs: targetDocId
            ? persistedAfterCorrection.filter((doc) => String(doc?._id || '') === String(targetDocId))
            : persistedAfterCorrection,
          expectedAvailability,
          expectedVariantMap,
        });
        if (mismatchStillExists) {
          throw new Error(
            `[POS Sync] Persisted state mismatch remains after corrective write for ${stkCode}`,
          );
        }
      }

      parsedCount += 1;
      const updatedAt = writeUpdates?.updatedAt instanceof Date ? writeUpdates.updatedAt : now;
      logger.log('[POS Sync] Upsert successful', {
        stk_code: stkCode,
        targetDocId: String(targetDocId || ''),
        updatedAt: formatDateHourMinute(updatedAt),
        updatedAtIso: updatedAt instanceof Date && !Number.isNaN(updatedAt.getTime())
          ? updatedAt.toISOString()
          : null,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId,
      });
      logger.log('[POS Sync] Post-write verification', {
        stk_code: stkCode,
        documentsFound: persistedDocs.length,
        documents: persistedDocs.slice(0, 5).map((doc) => ({
          _id: String(doc?._id || ''),
          updatedAt: doc?.updatedAt || null,
          availability: doc?.availability || null,
          colorVariants: Array.isArray(doc?.colorVariants)
            ? doc.colorVariants.map((variant) => ({
                stk_code: variant?.stk_code,
                in_stock: variant?.in_stock,
                active: variant?.active,
                price: variant?.price,
              }))
            : [],
        })),
      });
    } catch (error) {
      errors.push({ stk_code: stkCode, error: error.message });
      logger.error('[POS Sync] Error processing row', { 
        stk_code: stkCode, 
        error: error.message,
        details: error?.errInfo?.details || error?.errorResponse?.errInfo?.details || null,
        rawErrInfo: error?.errInfo || error?.errorResponse?.errInfo || null,
        stack: error.stack
      });
    }
  }

  const syncFinishedAt = new Date();
  logger.log('[POS Sync] Final Summary', {
    totalRows: rows.length,
    parsedCount,
    skipped,
    skipReasons,
    errorCount: errors.length,
    successRate: `${((parsedCount / rows.length) * 100).toFixed(2)}%`,
    startedAt: formatDateHourMinute(syncStartedAt),
    startedAtIso: syncStartedAt.toISOString(),
    finishedAt: formatDateHourMinute(syncFinishedAt),
    finishedAtIso: syncFinishedAt.toISOString(),
  });

  if (errors.length > 0) {
    logger.log('[POS Sync] Error details:', errors.slice(0, 10)); // Log first 10 errors
  }

  return {
    totalRows: rows.length,
    parsedCount,
    skipped,
    skipReasons,
    errors,
  };
}

module.exports = {
  syncPosProducts,
};
