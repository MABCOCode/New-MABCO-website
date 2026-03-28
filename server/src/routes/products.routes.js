const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');

const router = express.Router();

const computeContentMissing = (product) => {
  const name = typeof product?.name === 'object' ? product?.name?.en : product?.name;
  const nameAr = product?.nameAr || (typeof product?.name === 'object' ? product?.name?.ar : '');
  const description = product?.description || '';
  const descriptionAr = product?.descriptionAr || '';
  const image = product?.image || '';
  const specs = Array.isArray(product?.specs) ? product.specs : [];
  const inTheBox = Array.isArray(product?.inTheBox) ? product.inTheBox : [];
  const galleryImages = Array.isArray(product?.images) ? product.images : [];
  const colors = Array.isArray(product?.colorVariants) ? product.colorVariants : [];

  const colorImagesMissing = colors.filter((color) => {
    const nameVal = color?.name || color?.color_name || '';
    const nameArVal = color?.nameAr || color?.color_name_ar || nameVal || '';
    const images = Array.isArray(color?.images)
      ? color.images.map((img) => (typeof img === 'string' ? img : img?.image_link || img?.url || '')).filter(Boolean)
      : [];
    const imageVal = color?.image || images[0] || '';
    return !String(nameVal || nameArVal).trim() || !String(imageVal).trim();
  }).length;

  const hasSpecs = specs.length > 0;
  const hasDescription = String(description).trim().length > 0 || String(descriptionAr).trim().length > 0;
  const hasName = String(name).trim().length > 0 && String(nameAr).trim().length > 0;
  const hasColorImages = colors.some((color) => {
    const images = Array.isArray(color?.images)
      ? color.images.map((img) => (typeof img === 'string' ? img : img?.image_link || img?.url || '')).filter(Boolean)
      : [];
    const imageVal = color?.image || images[0] || '';
    return String(imageVal).trim().length > 0;
  });
  const hasImage = String(image).trim().length > 0 || hasColorImages;
  const hasGallery = galleryImages.length > 0;
  const hasBox = inTheBox.length > 0;
  const hasCategory = String(product?.category || '').trim().length > 0;
  const hasBrand = String(product?.brand || '').trim().length > 0;

  const missing = {
    name: !hasName,
    description: !hasDescription,
    specs: !hasSpecs,
    image: !hasImage,
    colorImages: colorImagesMissing,
    galleryImages: !hasGallery,
    inTheBox: !hasBox,
    category: !hasCategory,
    brand: !hasBrand,
  };

  const hasMissing =
    missing.name ||
    missing.description ||
    missing.specs ||
    missing.image ||
    missing.colorImages > 0 ||
    missing.galleryImages ||
    missing.inTheBox ||
    missing.category ||
    missing.brand;

  return { missing, hasMissing };
};

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 500);
  const skip = (page - 1) * limit;
  const useLiteProjection = req.query.lite === '1' || req.query.lite === 'true';
  const useCardProjection = req.query.card === '1' || req.query.card === 'true';

  const query = {};
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

  const [items, total] = await Promise.all([
    db.collection('products')
      .find(query, projection ? { projection } : {})
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .toArray(),
    doCount
      ? db.collection('products').countDocuments(query)
      : Promise.resolve(null),
  ]);

  const includeMissing = req.query.include_missing === '1' || req.query.include_missing === 'true';
  const shouldExcludeMissing =
    !includeMissing &&
    (req.query.brand_code ||
      req.query.cat_code ||
      req.query.brand ||
      req.query.category ||
      req.query.categoryId ||
      req.query.brandId);

  const hydrated = hydrateCollection('products', items);
  const filtered = shouldExcludeMissing
    ? hydrated.filter((item) => !computeContentMissing(item).hasMissing)
    : hydrated;

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
    price: 1,
    image: 1,
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
    status: 1,
    updatedAt: 1,
  };

  const baseQuery = {
    'status.isHidden': { $ne: true },
    'status.isActive': true,
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

  const filteredNewHot = sortByPriceDesc(newHot).filter((item) => parsePrice(item.price) > 10).slice(0, limit);
  const filteredMostSold = sortByPriceDesc(mostSold).slice(0, limit);

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

  res.json({ success: true, data: hydrateDocument('products', item) });
}));

module.exports = router;
