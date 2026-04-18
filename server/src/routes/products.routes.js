const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');
const { filterProductForCatalog, validateProductContent } = require('../utils/productContentValidation');

const router = express.Router();

async function collectCatalogReadyProducts({
  collection,
  query,
  projection,
  sort,
  rawSkip = 0,
  targetCount,
  batchSize,
}) {
  let scanned = rawSkip;
  let filtered = [];

  while (filtered.length < targetCount) {
    const items = await collection
      .find(query, projection ? { projection } : {})
      .sort(sort)
      .skip(scanned)
      .limit(batchSize)
      .toArray();

    if (items.length === 0) break;

    const hydrated = hydrateCollection('products', items);
    const catalogReadyBatch = hydrated
      .map((item) => {
        const validation = validateProductContent(item);
        if (!validation.isCatalogReady) return null;
        return filterProductForCatalog(item, validation);
      })
      .filter(Boolean);

    filtered = filtered.concat(catalogReadyBatch);
    scanned += items.length;

    if (items.length < batchSize) break;
  }

  return filtered;
}

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 500);
  const skip = (page - 1) * limit;
  const useLiteProjection = req.query.lite === '1' || req.query.lite === 'true';
  const useCardProjection = req.query.card === '1' || req.query.card === 'true';
  const includeHidden = req.query.include_hidden === '1' || req.query.include_hidden === 'true';
  const includeUnavailable = req.query.include_unavailable === '1' || req.query.include_unavailable === 'true';

  const query = {};
  if (!includeHidden && req.query.hidden !== 'true') {
    query['status.isHidden'] = { $ne: true };
  }
  const shouldFilterAvailability = !includeUnavailable && req.query.available !== 'false';
  const search = String(req.query.search || '').trim();
  if (req.query.categoryId) query.categoryIds = new ObjectId(req.query.categoryId);
  if (req.query.brandId) query.brandId = new ObjectId(req.query.brandId);
  if (req.query.cat_code) query.cat_code = String(req.query.cat_code);
  if (req.query.brand_code) query.brand_code = String(req.query.brand_code);
  if (req.query.stk_code) query.stk_code = String(req.query.stk_code);
  if (req.query.stk_codes) {
    const codes = String(req.query.stk_codes)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (codes.length > 0) {
      query.stk_code = { $in: codes };
    }
  }
  if (req.query.ids) {
    const ids = String(req.query.ids)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (ids.length > 0) {
      query.id = { $in: ids };
    }
  }
  if (req.query.category) query.category = String(req.query.category);
  if (req.query.brand) query.brand = String(req.query.brand);
  if (req.query.offer_type) {
    const offerType = String(req.query.offer_type);
    const scope = String(req.query.offer_scope || '').toLowerCase();
    if (scope === 'product') {
      query.$or = [
        { "offers.offer_type": offerType },
        { "offers.type": offerType },
      ];
    } else if (scope === 'color') {
      query.$or = [
        { "colorVariants.offers.offer_type": offerType },
        { "colorVariants.offers.type": offerType },
      ];
    } else if (scope === 'charge') {
      query.$or = [
        { "chargeOptions.offers.offer_type": offerType },
        { "chargeOptions.offers.type": offerType },
      ];
    } else {
      query.$or = [
        { "offers.offer_type": offerType },
        { "offers.type": offerType },
        { "colorVariants.offers.offer_type": offerType },
        { "colorVariants.offers.type": offerType },
        { "chargeOptions.offers.offer_type": offerType },
        { "chargeOptions.offers.type": offerType },
      ];
    }
  }
  if (req.query.is_most_sold === 'true' || req.query.isMostSold === 'true') {
    query.$or = [
      ...(query.$or || []),
      { isMostSold: true },
      { is_most_sold: true },
    ];
  }
  if (req.query.is_new === 'true' || req.query.isNew === 'true') {
    query.$or = [
      ...(query.$or || []),
      { isNew: true },
      { is_new: true },
      {price: {$gt: 10}},
      {cat_code: {$ne: "02"}}, {cat_code: {$ne: "07"}} // treat products with price > 0 as new if isNew flag is missing
    ];
  }
  if (req.query.is_hot === 'true' || req.query.isHot === 'true' || req.query.is_best === 'true' || req.query.isBest === 'true') {
    query.$or = [
      ...(query.$or || []),
      { isHot: true },
      { is_hot: true },
      { isBest: true },
      { is_best: true },
      
      {price: {$gt: 10}},
    ];
  }
  if (req.query.active === 'true') query['status.isActive'] = true;
  if (req.query.hidden === 'true') query['status.isHidden'] = true;
  if (shouldFilterAvailability) {
    const availabilityOr = [
      { 'availability.isAvailable': { $ne: false } },
      { cat_code: '09', brand_code: '81' },
    ];
    if (query.$or) {
      query.$and = [...(query.$and || []), { $or: query.$or }, { $or: availabilityOr }];
      delete query.$or;
    } else {
      query.$or = availabilityOr;
    }
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { stk_code: { $regex: escaped, $options: 'i' } },
      { id: { $regex: escaped, $options: 'i' } },
      { name: { $regex: escaped, $options: 'i' } },
      { nameAr: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
      { descriptionAr: { $regex: escaped, $options: 'i' } },
      { brand: { $regex: escaped, $options: 'i' } },
      { brand_code: { $regex: escaped, $options: 'i' } },
      { category: { $regex: escaped, $options: 'i' } },
      { categoryAr: { $regex: escaped, $options: 'i' } },
      { cat_code: { $regex: escaped, $options: 'i' } },
      { 'specs.title': { $regex: escaped, $options: 'i' } },
      { 'specs.titleAr': { $regex: escaped, $options: 'i' } },
      { 'specs.value': { $regex: escaped, $options: 'i' } },
      { 'specs.valueAr': { $regex: escaped, $options: 'i' } },
    ];
  }

  // Determine sort order: price ascending for brand queries, updatedAt descending otherwise
  const sort = req.query.brand_code ? { price: 1 } : { updatedAt: -1 };

  const doCount = !(req.query.count === '0' || req.query.count === 'false');

  const projection = useCardProjection
    ? {
        _id: 1,
        stk_code: 1,
        id: 1,
        slug: 1,
        name: 1,
        nameAr: 1,
        description: 1,
        descriptionAr: 1,
        price: 1,
        image: 1,
        images: 1,
        category: 1,
        categoryAr: 1,
        cat_code: 1,
        brand: 1,
        brand_code: 1,
        badge: 1,
        isMostSold: 1,
        isNew: 1,
        isHot: 1,
        offers: 1,
        availability: 1,
        colorVariants: 1,
        chargeOptions: 1,
        specs: 1,
        status: 1,
        updatedAt: 1,
      }
    : useLiteProjection
    ? {
        _id: 1,
        stk_code: 1,
        id: 1,
        slug: 1,
        name: 1,
        nameAr: 1,
        description: 1,
        descriptionAr: 1,
        price: 1,
        image: 1,
        images: 1,
        category: 1,
        categoryAr: 1,
        cat_code: 1,
        brand: 1,
        brand_code: 1,
        badge: 1,
        isMostSold: 1,
        isNew: 1,
        isHot: 1,
        specs: 1,
        specifications: 1,
        offers: 1,
        availability: 1,
        colorVariants: 1,
        chargeOptions: 1,
        status: 1,
        updatedAt: 1,
      }
    : undefined;

  const includeMissing = req.query.include_missing === '1' || req.query.include_missing === 'true';
  const shouldExcludeMissing = !includeMissing;

  let filtered = [];
  let total = null;

  if (shouldExcludeMissing) {
    if (!doCount) {
      const batchSize = Math.min(Math.max(limit * 3, 60), 250);
      const targetCount = skip + limit;
      const catalogReady = await collectCatalogReadyProducts({
        collection: db.collection('products'),
        query,
        projection,
        sort,
        rawSkip: 0,
        targetCount,
        batchSize,
      });

      total = null;
      filtered = catalogReady.slice(skip, skip + limit);
    } else {
      const items = await db.collection('products')
        .find(query, projection ? { projection } : {})
        .sort(sort)
        .toArray();

      const hydrated = hydrateCollection('products', items);
      const catalogReady = hydrated
        .map((item) => {
          const validation = validateProductContent(item);
          if (!validation.isCatalogReady) return null;
          return filterProductForCatalog(item, validation);
        })
        .filter(Boolean);

      total = catalogReady.length;
      filtered = catalogReady.slice(skip, skip + limit);
    }
  } else {
    const [items, count] = await Promise.all([
      db.collection('products')
        .find(query, projection ? { projection } : {})
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray(),
      doCount
        ? db.collection('products').countDocuments(query)
        : Promise.resolve(null),
    ]);

    filtered = hydrateCollection('products', items);
    total = count;
  }

  const response = {
    success: true,
    data: filtered,
    pagination: { page, limit },
  };
  if (doCount) response.pagination.total = total;

  res.json(response);
}));

router.get('/home-sliders', asyncHandler(async (req, res) => {
  const db = getDb();
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 60);

  const cardProjection = {
    _id: 1,
    stk_code: 1,
    id: 1,
    slug: 1,
    name: 1,
    nameAr: 1,
    description: 1,
    descriptionAr: 1,
    price: 1,
    image: 1,
    images: 1,
    category: 1,
    categoryAr: 1,
    cat_code: 1,
    brand: 1,
    brand_code: 1,
    badge: 1,
    isMostSold: 1,
    isNew: 1,
    isHot: 1,
    offers: 1,
    availability: 1,
    colorVariants: 1,
    chargeOptions: 1,
    specs: 1,
    status: 1,
    updatedAt: 1,
  };

  const baseQuery = {
    'status.isHidden': { $ne: true },
    'status.isActive': true,
    'availability.isAvailable': { $ne: false },
  };

  const parsePrice = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(String(value).replace(/,/g, '').trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const excludeCat02 = { cat_code: { $ne: '02' } };

  const mostSoldQuery = {
    ...excludeCat02,
    ...baseQuery,
    $or: [{ isMostSold: true }, { is_most_sold: true }],
  };

  const newHotQuery = {
    ...excludeCat02,
    ...baseQuery,
    $or: [{ isNew: true }, { is_new: true }, { isHot: true }, { is_hot: true }],
    price: { $exists: true, $ne: '', $ne: null },
  };

  const [mostSold, newHot] = await Promise.all([
    db
      .collection('products')
      .find(mostSoldQuery, { projection: cardProjection })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray(),
    db
      .collection('products')
      .find(newHotQuery, { projection: cardProjection })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray(),
  ]);

  const sortByPriceDesc = (items) =>
    items
      .map((item) => ({ ...item, _priceValue: parsePrice(item.price) }))
      .filter((item) => item._priceValue > 0)
      .sort((a, b) => b._priceValue - a._priceValue)
      .map(({ _priceValue, ...rest }) => rest);

  const filteredNewHot = sortByPriceDesc(newHot)
    .filter((item) => parsePrice(item.price) > 10)
    .map((item) => {
      const validation = validateProductContent(item);
      return validation.isCatalogReady ? filterProductForCatalog(item, validation) : null;
    })
    .filter(Boolean)
    .slice(0, limit);

  const filteredMostSold = sortByPriceDesc(mostSold)
    .map((item) => {
      const validation = validateProductContent(item);
      return validation.isCatalogReady ? filterProductForCatalog(item, validation) : null;
    })
    .filter(Boolean)
    .slice(0, limit);

  res.json({
    success: true,
    data: {
      mostSold: hydrateCollection('products', filteredMostSold),
      newHot: hydrateCollection('products', filteredNewHot),
    },
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const query = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : {
        $or: [
          { slug: id },
          { stk_code: String(id) },
          { id: String(id) },
        ],
      };
  const item = await db.collection('products').findOne(query);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (req.query.include_hidden !== 'true' && item?.status?.isHidden === true) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  const isSpecialCategory = item?.cat_code === '09' && item?.brand_code === '81';
  if (req.query.include_unavailable !== 'true' && item?.availability?.isAvailable === false && !isSpecialCategory) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: hydrateDocument('products', item) });
}));

module.exports = router;
