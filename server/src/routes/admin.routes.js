const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

router.get('/users', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.role) query.role = req.query.role;

  const items = await db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: items });
}));

router.get('/orders', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const items = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: items });
}));

router.get('/notifications', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const items = await db.collection('notifications').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: items });
}));

router.get('/reports/daily-kpis', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.date = {};
    if (req.query.from) query.date.$gte = new Date(req.query.from);
    if (req.query.to) query.date.$lte = new Date(req.query.to);
  }

  const data = await db.collection('report_daily_kpis').find(query).sort({ date: 1 }).toArray();
  res.json({ success: true, data });
}));

router.get('/actions', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.targetType) query.targetType = req.query.targetType;
  if (req.query.actionType) query.actionType = req.query.actionType;
  if (req.query.actorUserId && ObjectId.isValid(req.query.actorUserId)) {
    query.actorUserId = new ObjectId(req.query.actorUserId);
  }

  const [items, total] = await Promise.all([
    db.collection('admin_actions').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('admin_actions').countDocuments(query),
  ]);

  res.json({ success: true, data: items, pagination: { page, limit, total } });
}));

router.get('/analytics/visitor-sessions', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.eventAt = {};
    if (req.query.from) query.eventAt.$gte = new Date(req.query.from);
    if (req.query.to) query.eventAt.$lte = new Date(req.query.to);
  }

  const items = await db
    .collection('web_events')
    .find(query)
    .sort({ eventAt: -1 })
    .limit(5000)
    .toArray();

  res.json({ success: true, data: items });
}));

router.get('/analytics/cart-events', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.eventAt = {};
    if (req.query.from) query.eventAt.$gte = new Date(req.query.from);
    if (req.query.to) query.eventAt.$lte = new Date(req.query.to);
  }

  const items = await db
    .collection('cart_events')
    .find(query)
    .sort({ eventAt: -1 })
    .limit(5000)
    .toArray();

  res.json({ success: true, data: items });
}));

router.get('/product-revisions/:productId', asyncHandler(async (req, res) => {
  const db = getDb();
  const { productId } = req.params;

  const query = {};
  if (ObjectId.isValid(productId)) {
    query.productId = new ObjectId(productId);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid productId' });
  }

  const data = await db.collection('product_revisions').find(query).sort({ version: -1 }).toArray();
  res.json({ success: true, data });
}));

module.exports = router;
