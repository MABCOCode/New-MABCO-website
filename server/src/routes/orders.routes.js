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
  if (req.query.status) query.status = req.query.status;
  if (req.query.userId && ObjectId.isValid(req.query.userId)) {
    query.userId = new ObjectId(req.query.userId);
  }

  const [items, total] = await Promise.all([
    db.collection('orders').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('orders').countDocuments(query),
  ]);

  res.json({ success: true, data: items, pagination: { page, limit, total } });
}));

module.exports = router;
