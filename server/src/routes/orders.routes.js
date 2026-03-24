const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');

const router = express.Router();

function buildOrderNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${date}-${rand}`;
}

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = req.body || {};
  const now = new Date();

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  const items = rawItems.map((item) => {
    const qtyRaw = item?.qty ?? item?.quantity ?? 1;
    const qty = Math.min(2, Math.max(1, parseInt(qtyRaw, 10) || 1));
    return {
      ...item,
      qty,
    };
  });
  if (items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items are required.' });
  }

  const orderDoc = {
    orderNumber: payload.orderNumber || buildOrderNumber(),
    userId: payload.userId && ObjectId.isValid(String(payload.userId)) ? new ObjectId(String(payload.userId)) : null,
    customerSnapshot: payload.customerSnapshot || payload.customer || {},
    items,
    pricing: payload.pricing || {},
    status: payload.status || 'pending',
    statusHistory: Array.isArray(payload.statusHistory) && payload.statusHistory.length > 0
      ? payload.statusHistory
      : [{ status: payload.status || 'pending', date: now, note: 'Order created' }],
    payment: payload.payment || { method: 'cash', status: 'pending' },
    fulfillment: payload.fulfillment || payload.fulfillmentType || null,
    addresses: payload.addresses || null,
    appliedOffersSnapshot: payload.appliedOffersSnapshot || payload.appliedOffers || [],
    locale: payload.locale || 'ar',
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('orders').insertOne(orderDoc);
  const saved = await db.collection('orders').findOne({ _id: result.insertedId });

  res.status(201).json({ success: true, data: hydrateCollection('orders', [saved])[0] });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const query = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { orderNumber: String(id) };

  const order = await db.collection('orders').findOne(query);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: hydrateCollection('orders', [order])[0] });
}));

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
  if (req.query.phone) {
    const phone = String(req.query.phone).trim();
    if (phone) {
      query.$or = [
        { 'customerSnapshot.phone': phone },
        { 'customerSnapshot.secondaryPhone': phone },
      ];
    }
  }

  const [items, total] = await Promise.all([
    db.collection('orders').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('orders').countDocuments(query),
  ]);

  res.json({
    success: true,
    data: hydrateCollection('orders', items),
    pagination: { page, limit, total },
  });
}));

module.exports = router;
