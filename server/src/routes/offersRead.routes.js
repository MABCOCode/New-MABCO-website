const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');
const { rebuildOffersRead } = require('../services/offersRead.service');
const { requireAdminKey } = require('../middleware/adminAuth');

const router = express.Router();

const getProductKey = (product) =>
  String(product?.id || product?.stk_code || product?._id || product?.slug || '');

const getVariantKey = (variant) =>
  String(
    variant?.stk_code ||
      variant?.id ||
      variant?.name ||
      variant?.color_name ||
      variant?.nameAr ||
      '',
  );

const getChargeKey = (opt) =>
  String(
    opt?.stk_code ||
      opt?.id ||
      opt?.value ||
      opt?.name ||
      opt?.valueAr ||
      opt?.name_ar ||
      '',
  );

const collectOffersWithPath = (product, basePath) => {
  const items = [];
  const productOffers = Array.isArray(product?.offers) ? product.offers : [];
  productOffers.forEach((offer, idx) => {
    items.push({ offer, path: `${basePath}.offers[${idx}]` });
  });

  const colorVariants = Array.isArray(product?.colorVariants) ? product.colorVariants : [];
  colorVariants.forEach((variant, vIdx) => {
    const offers = Array.isArray(variant?.offers) ? variant.offers : [];
    offers.forEach((offer, oIdx) => {
      items.push({ offer, path: `${basePath}.colorVariants[${vIdx}].offers[${oIdx}]` });
    });
  });

  const chargeOptions = Array.isArray(product?.chargeOptions) ? product.chargeOptions : [];
  chargeOptions.forEach((opt, cIdx) => {
    const offers = Array.isArray(opt?.offers) ? opt.offers : [];
    offers.forEach((offer, oIdx) => {
      items.push({ offer, path: `${basePath}.chargeOptions[${cIdx}].offers[${oIdx}]` });
    });
  });

  return items;
};

const mergeOffersByNo = (existing = [], incoming = []) => {
  const map = new Map();
  existing.forEach((offer) => {
    const key = String(offer?.offer_no || '');
    if (key) map.set(key, offer);
  });
  incoming.forEach((offer) => {
    const key = String(offer?.offer_no || '');
    if (!key) return;
    map.set(key, offer);
  });
  return Array.from(map.values());
};

const mergeVariantList = (existingList = [], incomingList = [], keyFn) => {
  const byKey = new Map();
  existingList.forEach((item) => {
    const key = keyFn(item);
    if (key) byKey.set(key, { ...item });
  });
  incomingList.forEach((item) => {
    const key = keyFn(item);
    if (!key) return;
    const current = byKey.get(key);
    if (!current) {
      byKey.set(key, { ...item });
      return;
    }
    const merged = { ...current, ...item };
    merged.offers = mergeOffersByNo(
      Array.isArray(current.offers) ? current.offers : [],
      Array.isArray(item.offers) ? item.offers : [],
    );
    byKey.set(key, merged);
  });
  return Array.from(byKey.values());
};

const mergeProducts = (existingProducts = [], incomingProducts = []) => {
  const byKey = new Map();
  existingProducts.forEach((product) => {
    const key = getProductKey(product);
    if (key) byKey.set(key, { ...product });
  });

  incomingProducts.forEach((product) => {
    const key = getProductKey(product);
    if (!key) return;
    const current = byKey.get(key);
    if (!current) {
      byKey.set(key, { ...product });
      return;
    }
    const merged = { ...current, ...product };
    merged.offers = mergeOffersByNo(
      Array.isArray(current.offers) ? current.offers : [],
      Array.isArray(product.offers) ? product.offers : [],
    );
    merged.colorVariants = mergeVariantList(
      Array.isArray(current.colorVariants) ? current.colorVariants : [],
      Array.isArray(product.colorVariants) ? product.colorVariants : [],
      getVariantKey,
    );
    merged.chargeOptions = mergeVariantList(
      Array.isArray(current.chargeOptions) ? current.chargeOptions : [],
      Array.isArray(product.chargeOptions) ? product.chargeOptions : [],
      getChargeKey,
    );
    byKey.set(key, merged);
  });

  return Array.from(byKey.values());
};

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const offerType = String(req.query.offer_type || req.query.offerType || '').trim();
  const locale = String(req.query.locale || 'default').trim();

  const query = {};
  if (offerType) query.offerType = offerType;
  if (locale) query.locale = locale;

  const items = await db
    .collection('offers_read')
    .find(query)
    .limit(offerType ? 1 : 20)
    .toArray();

  res.json({ success: true, data: hydrateCollection('offers_read', items) });
}));

router.post('/rebuild', requireAdminKey, asyncHandler(async (req, res) => {
  const db = getDb();
  const start = Date.now();
  const sync = String(req.query.sync || '').toLowerCase() === 'true';

  if (sync) {
    const payloads = Array.isArray(req.body) ? req.body : [];
    if (payloads.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of offers_read documents in the request body.',
      });
    }

    const ops = [];
    for (const doc of payloads) {
      const offerType = doc?.offerType;
      const locale = doc?.locale || 'default';
      const payload = doc?.payload;
      if (!offerType || !payload) continue;

      const products = Array.isArray(payload?.products) ? payload.products : [];
      const missingOfferNo = [];
      products.forEach((product, pIdx) => {
        const entries = collectOffersWithPath(product, `payload.products[${pIdx}]`);
        entries.forEach(({ offer, path }) => {
          if (!offer || !offer.offer_no) {
            missingOfferNo.push(path);
          }
        });
      });

      if (missingOfferNo.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'All offers must include offer_no.',
          missingOfferNo,
        });
      }

      const existing = await db.collection('offers_read').findOne({ offerType, locale });
      const existingPayload = existing?.payload || {};
      const mergedProducts = mergeProducts(
        Array.isArray(existingPayload.products) ? existingPayload.products : [],
        products,
      );
      const mergedPayload = {
        ...existingPayload,
        ...payload,
        products: mergedProducts,
      };

      ops.push({
        updateOne: {
          filter: { offerType, locale },
          update: { $set: { offerType, locale, payload: mergedPayload } },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid offers_read documents found in the request body.',
      });
    }

    const result = await db.collection('offers_read').bulkWrite(ops, { ordered: false });
    return res.json({
      success: true,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      },
      durationMs: Date.now() - start,
    });
  }

  const result = await rebuildOffersRead(db, { logger: console });
  res.json({
    success: true,
    data: result,
    durationMs: Date.now() - start,
  });
}));

module.exports = router;
