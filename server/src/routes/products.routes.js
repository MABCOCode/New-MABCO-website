const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.categoryId) query.categoryIds = new ObjectId(req.query.categoryId);
  if (req.query.brandId) query.brandId = new ObjectId(req.query.brandId);
  if (req.query.active === 'true') query['status.isActive'] = true;
  if (req.query.hidden === 'true') query['status.isHidden'] = true;

  const [items, total] = await Promise.all([
    db.collection('products').find(query).skip(skip).limit(limit).sort({ updatedAt: -1 }).toArray(),
    db.collection('products').countDocuments(query),
  ]);

  res.json({ success: true, data: items, pagination: { page, limit, total } });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id };
  const item = await db.collection('products').findOne(query);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: item });
}));

module.exports = router;
