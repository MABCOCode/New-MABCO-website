const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;
  const useLiteProjection = req.query.lite === '1' || req.query.lite === 'true';
  const useCardProjection = req.query.card === '1' || req.query.card === 'true';

  const query = {};
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
  if (req.query.category) query.category = String(req.query.category);
  if (req.query.brand) query.brand = String(req.query.brand);
  if (req.query.active === 'true') query['status.isActive'] = true;
  if (req.query.hidden === 'true') query['status.isHidden'] = true;

  const projection = useCardProjection
    ? {
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
    db.collection('products').find(query, projection ? { projection } : {}).skip(skip).limit(limit).sort({ updatedAt: -1 }).toArray(),
    db.collection('products').countDocuments(query),
  ]);

  res.json({
    success: true,
    data: hydrateCollection('products', items),
    pagination: { page, limit, total },
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
