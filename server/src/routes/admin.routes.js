const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

function toObjectIdArray(values = []) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (ObjectId.isValid(String(value)) ? new ObjectId(String(value)) : null))
    .filter(Boolean);
}

router.get('/users', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.role) query.role = req.query.role;

  const items = await db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: items });
}));

router.get('/users/:id/permissions', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const user = await db.collection('users').findOne(
    { _id: new ObjectId(id), role: { $in: ['admin', 'super_admin'] } },
    { projection: { email: 1, role: 1, adminMeta: 1 } },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'Admin user not found' });
  }

  const adminMeta = user.adminMeta || {};
  res.json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: {
        allowAllCategories: Boolean(adminMeta.allowAllCategories),
        allowAllBrands: Boolean(adminMeta.allowAllBrands),
        allowedCategoryIds: adminMeta.allowedCategoryIds || [],
        allowedBrandIds: adminMeta.allowedBrandIds || [],
        isSuspended: Boolean(adminMeta.isSuspended),
      },
    },
  });
}));

router.put('/users/:id/permissions', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const allowAllCategories = Boolean(req.body.allowAllCategories);
  const allowAllBrands = Boolean(req.body.allowAllBrands);
  const allowedCategoryIds = toObjectIdArray(req.body.allowedCategoryIds);
  const allowedBrandIds = toObjectIdArray(req.body.allowedBrandIds);
  const isSuspended = req.body.isSuspended === undefined ? undefined : Boolean(req.body.isSuspended);

  const setDoc = {
    'adminMeta.allowAllCategories': allowAllCategories,
    'adminMeta.allowAllBrands': allowAllBrands,
    'adminMeta.allowedCategoryIds': allowAllCategories ? [] : allowedCategoryIds,
    'adminMeta.allowedBrandIds': allowAllBrands ? [] : allowedBrandIds,
  };
  if (isSuspended !== undefined) {
    setDoc['adminMeta.isSuspended'] = isSuspended;
  }

  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id), role: { $in: ['admin', 'super_admin'] } },
    { $set: setDoc },
    {
      returnDocument: 'after',
      projection: { email: 1, role: 1, adminMeta: 1 },
    },
  );

  if (!result) {
    return res.status(404).json({ success: false, message: 'Admin user not found' });
  }

  res.json({ success: true, data: result });
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
