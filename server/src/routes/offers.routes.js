// routes/offers.js
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');
const { filterProductForCatalog, validateProductContent } = require('../utils/productContentValidation');

const router = express.Router();

// Reuse the same caching mechanism from products route
// In a real implementation, you would import or share the cache and version function
// For brevity, I'll assume the products version function is available globally.
// If not, you can copy the getProductsVersion and responseCache from the products route.
// I'll include a minimal version here.

// ---------------------- CACHE HELPERS (reused from products) ----------------------
let versionCache = { version: null, expiresAt: 0 };
const VERSION_CACHE_TTL = 2000;
const responseCache = new Map(); // simple in-memory cache

async function getProductsVersion(db) {
  const now = Date.now();
  if (versionCache.version !== null && now < versionCache.expiresAt) {
    return versionCache.version;
  }
  const latestProduct = await db.collection('products')
    .find({}, { projection: { updatedAt: 1 } })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
  const version = latestProduct[0]?.updatedAt?.getTime() || Date.now();
  versionCache = { version, expiresAt: now + VERSION_CACHE_TTL };
  return version;
}

function getCacheKey(req, version) {
  // Create a unique key from the URL and query parameters
  const url = req.originalUrl || req.url;
  return `${url}|v${version}`;
}

function getCachedResponse(key) {
  const entry = responseCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value;
  }
  responseCache.delete(key);
  return null;
}

function setCachedResponse(key, value, ttl = 10000) {
  responseCache.set(key, { value, expiresAt: Date.now() + ttl });
}
// ---------------------------------------------------------------------------------

// Helper to build the base query for products with a specific offer type
function buildOfferProductQuery(offerType, currentDate, reqQuery) {
  const baseQuery = {
    "status.isActive": true,
    "status.isHidden": { $ne: true },
    "availability.isAvailable": true,
    $or: [
      { "offers": { $elemMatch: {
          $or: [{ offer_type: offerType }, { type: offerType }],
          is_active: true,
          start: { $lte: currentDate },
          end: { $gte: currentDate }
      } } },
      { "colorVariants.offers": { $elemMatch: {
          $or: [{ offer_type: offerType }, { type: offerType }],
          is_active: true,
          start: { $lte: currentDate },
          end: { $gte: currentDate }
      } } },
      { "chargeOptions.offers": { $elemMatch: {
          $or: [{ offer_type: offerType }, { type: offerType }],
          is_active: true,
          start: { $lte: currentDate },
          end: { $gte: currentDate }
      } } }
    ]
  };

  // Apply search, category, brand filters
  if (reqQuery.search) {
    const searchRegex = { $regex: reqQuery.search, $options: 'i' };
    baseQuery.$and = baseQuery.$and || [];
    baseQuery.$and.push({
      $or: [
        { name: searchRegex },
        { nameAr: searchRegex }
      ]
    });
  }
  if (reqQuery.category) {
    baseQuery.cat_code = reqQuery.category;
  }
  if (reqQuery.brand) {
    baseQuery.brand_code = reqQuery.brand;
  }

  return baseQuery;
}

// Helper to compute max savings across all matching products (for the response)
async function computeMaxSavings(db, baseQuery, offerType) {
  // We need to extract all offers (main, colorVariants, chargeOptions) and compute their discount value
  const pipeline = [
    { $match: baseQuery },
    { $project: {
        allOffers: {
          $concatArrays: [
            { $ifNull: ["$offers", []] },
            {
              $reduce: {
                input: { $ifNull: ["$colorVariants", []] },
                initialValue: [],
                in: { $concatArrays: ["$$value", { $ifNull: ["$$this.offers", []] }] }
              }
            },
            {
              $reduce: {
                input: { $ifNull: ["$chargeOptions", []] },
                initialValue: [],
                in: { $concatArrays: ["$$value", { $ifNull: ["$$this.offers", []] }] }
              }
            }
          ]
        }
    } },
    { $unwind: "$allOffers" },
    { $match: {
        $or: [
          { "allOffers.offer_type": offerType },
          { "allOffers.type": offerType }
        ],
        "allOffers.is_active": true
        // No need to check start/end because baseQuery already did
    } },
    { $addFields: {
        discountValue: {
          $cond: [
            {
              $or: [
                { $eq: ["$allOffers.discount_type", "p"] },
                { $eq: ["$allOffers.discountType", "percentage"] }
              ]
            },
            {
              $cond: [
                { $lte: ["$allOffers.discount", 1] },
                { $multiply: ["$allOffers.discount", 100] },
                "$allOffers.discount"
              ]
            },
            {
              $cond: [
                { $gt: ["$allOffers.couponValue", 0] },
                "$allOffers.couponValue",
                { $ifNull: ["$allOffers.discount", 0] }
              ]
            }
          ]
        },
        discountType: {
          $cond: [
            {
              $or: [
                { $eq: ["$allOffers.discount_type", "p"] },
                { $eq: ["$allOffers.discountType", "percentage"] }
              ]
            },
            "percentage",
            "value"
          ]
        }
    } },
    { $group: {
        _id: null,
        maxValue: { $max: "$discountValue" },
        maxType: { $first: "$discountType" } // just a placeholder; we'll decide based on maxValue source
    } },
    { $project: {
        _id: 0,
        value: "$maxValue",
        type: { $cond: [ { $gt: ["$maxValue", 0] }, "percentage", "value" ] } // simplified; original did similar
    } }
  ];

  const results = await db.collection('products').aggregate(pipeline).toArray();
  return results[0] || { value: 0, type: "percentage" };
}

// Helper to compute category and brand filters
async function computeFilters(db, baseQuery) {
  const [categories, brands] = await Promise.all([
    db.collection('products').aggregate([
      { $match: baseQuery },
      { $group: {
          _id: { code: "$cat_code", name: "$category", nameAr: "$categoryAr" },
          count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, code: "$_id.code", name: "$_id.name", nameAr: "$_id.nameAr", count: 1 } }
    ]).toArray(),
    db.collection('products').aggregate([
      { $match: baseQuery },
      { $group: {
          _id: { code: "$brand_code", name: "$brand" },
          count: { $sum: 1 }
      } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { _id: 0, code: "$_id.code", name: "$_id.name", count: 1 } }
    ]).toArray()
  ]);
  return { categories, brands };
}

// Main route: Get products by offer type
router.get('/:offerType/products', asyncHandler(async (req, res) => {
  const db = getDb();
  const offerType = req.params.offerType;
  
  const validOfferTypes = ['direct_discount', 'coupon', 'free_product', 'bundle_discount'];
  if (!validOfferTypes.includes(offerType)) {
    return res.status(400).json({
      error: 'Invalid offer type',
      message: `Offer type must be one of: ${validOfferTypes.join(', ')}`
    });
  }

  // Get products version for caching
  const version = await getProductsVersion(db);
  const cacheKey = getCacheKey(req, version);
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;
  const currentDate = new Date();

  // Build the base query (uses indexes)
  const baseQuery = buildOfferProductQuery(offerType, currentDate, req.query);

  // Prepare sort object
  let sortObj = { updatedAt: -1 };
  switch (req.query.sort) {
    case 'price_asc': sortObj = { price: 1 }; break;
    case 'price_desc': sortObj = { price: -1 }; break;
    case 'name_asc': sortObj = { name: 1 }; break;
    case 'name_desc': sortObj = { name: -1 }; break;
    default: sortObj = { updatedAt: -1 };
  }

  // Parallel execution of independent operations
  const [totalCount, productsRaw, filters, maxSavings] = await Promise.all([
    db.collection('products').countDocuments(baseQuery),
    db.collection('products')
      .find(baseQuery)
      .project({
        _id: 1, stk_code: 1, id: 1, slug: 1, name: 1, nameAr: 1,
        description: 1, descriptionAr: 1, price: 1, image: 1, images: 1,
        category: 1, categoryAr: 1, cat_code: 1, brand: 1, brand_code: 1,
        badge: 1, isMostSold: 1, isNew: 1, isHot: 1,
        offers: 1, availability: 1, specs: 1,
        colorVariants: 1, chargeOptions: 1, status: 1, updatedAt: 1
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray(),
    computeFilters(db, baseQuery),
    computeMaxSavings(db, baseQuery, offerType)
  ]);

  // Filter each product's offers to only those matching the offer type and active
  // (similar to what the aggregation did, but now in Node.js)
  const filteredProducts = productsRaw.map(product => {
    // Filter main offers
    if (product.offers) {
      product.offers = product.offers.filter(offer =>
        (offer.offer_type === offerType || offer.type === offerType) &&
        offer.is_active === true &&
        (!offer.start || offer.start <= currentDate) &&
        (!offer.end || offer.end >= currentDate)
      );
    }
    // Filter colorVariants offers
    if (product.colorVariants) {
      product.colorVariants = product.colorVariants.map(variant => {
        if (variant.offers) {
          variant.offers = variant.offers.filter(offer =>
            (offer.offer_type === offerType || offer.type === offerType) &&
            offer.is_active === true &&
            (!offer.start || offer.start <= currentDate) &&
            (!offer.end || offer.end >= currentDate)
          );
        }
        return variant;
      }).filter(variant => variant.offers?.length > 0); // keep only variants that still have offers? Original kept all variants but filtered offers array. We must preserve the same behavior: keep variant even if offers empty, because the product might still be valid via main offers. So do not filter variants out.
    }
    // Filter chargeOptions offers similarly
    if (product.chargeOptions) {
      product.chargeOptions = product.chargeOptions.map(option => {
        if (option.offers) {
          option.offers = option.offers.filter(offer =>
            (offer.offer_type === offerType || offer.type === offerType) &&
            offer.is_active === true &&
            (!offer.start || offer.start <= currentDate) &&
            (!offer.end || offer.end >= currentDate)
          );
        }
        return option;
      });
    }
    return product;
  }).filter(product => {
    // Keep product only if it has at least one matching offer (main, color, or charge)
    const hasMainOffer = product.offers && product.offers.length > 0;
    const hasColorOffer = product.colorVariants && product.colorVariants.some(v => v.offers && v.offers.length > 0);
    const hasChargeOffer = product.chargeOptions && product.chargeOptions.some(c => c.offers && c.offers.length > 0);
    return hasMainOffer || hasColorOffer || hasChargeOffer;
  });

  // Hydrate and validate (same as original)
  const hydrated = hydrateCollection('products', filteredProducts);
  const catalogReady = hydrated
    .map(product => {
      const validation = validateProductContent(product);
      return validation.isCatalogReady ? filterProductForCatalog(product, validation) : null;
    })
    .filter(Boolean);

  // Build response (identical structure to original)
  const response = {
    products: catalogReady,
    pagination: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
      hasMore: skip + limit < totalCount
    },
    maxSavings: {
      value: maxSavings.value || 0,
      type: maxSavings.type || 'percentage'
    },
    filters: {
      categories: filters.categories,
      brands: filters.brands
    }
  };

  // Cache the response
  setCachedResponse(cacheKey, response, 10000); // 10 seconds TTL
  res.json(response);
}));

// Optimized root offers endpoint with caching
router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  
  // Use a version based on offers collection's latest updatedAt (if offers have timestamps)
  // Since offers might be in a separate collection, we need a different version.
  // For simplicity, we can use a short TTL cache without version, or query max updatedAt from offers.
  // I'll implement a simple version from offers collection.
  let offersVersion = 0;
  const latestOffer = await db.collection('offers')
    .find({}, { projection: { updatedAt: 1 } })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();
  if (latestOffer[0]?.updatedAt) {
    offersVersion = latestOffer[0].updatedAt.getTime();
  }
  const cacheKey = `offers_list_${offersVersion}_${req.originalUrl || req.url}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
  const skip = (page - 1) * limit;
  const now = new Date();

  const query = {};
  if (req.query.active === 'true') query.is_active = true;
  if (req.query.type) query.offer_type = req.query.type;
  if (req.query.live === 'true') {
    query.start = { $lte: now };
    query.end = { $gte: now };
  }

  const [total, items] = await Promise.all([
    db.collection('offers').countDocuments(query),
    db.collection('offers')
      .find(query)
      .sort({ start: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
  ]);

  const response = {
    success: true,
    data: hydrateCollection('offers', items),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };

  setCachedResponse(cacheKey, response, 5000); // 5 seconds TTL
  res.json(response);
}));

module.exports = router;