const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');
const { sendToTokens } = require('../services/fcm');
const { normalizePhone, phoneVariants } = require('../utils/phone');

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

  const notificationTokens = payload.notificationToken
    ? Array.from(new Set([String(payload.notificationToken)]))
    : [];

  const customerPhoneRaw =
    payload?.customerSnapshot?.phone ||
    payload?.customerSnapshot?.secondaryPhone ||
    '';
  const normalizedCustomerPhone = normalizePhone(customerPhoneRaw);

  let resolvedUserId = payload.userId && ObjectId.isValid(String(payload.userId))
    ? new ObjectId(String(payload.userId))
    : null;

  if (!resolvedUserId && normalizedCustomerPhone) {
    const variants = phoneVariants(normalizedCustomerPhone);
    const user = await db.collection('users').findOne(
      { phone: { $in: variants } },
      { projection: { _id: 1 } },
    );
    if (user?._id) {
      resolvedUserId = user._id;
    }
  }

  const orderDoc = {
    orderNumber: payload.orderNumber || buildOrderNumber(),
    userId: resolvedUserId,
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
    notificationTokens,
    locale: payload.locale || 'ar',
    createdAt: now,
    updatedAt: now,
  };

  if (resolvedUserId && notificationTokens.length > 0) {
    await db.collection('users').updateOne(
      { _id: resolvedUserId },
      { $addToSet: { fcmTokens: { $each: notificationTokens } } },
    );
  }

  const result = await db.collection('orders').insertOne(orderDoc);
  const saved = await db.collection('orders').findOne({ _id: result.insertedId });

  // Notify admins with order-management permission
  try {
    const admins = await db
      .collection('users')
      .find(
        {
          role: 'admin',
          'adminMeta.canManageOrders': true,
        },
        { projection: { _id: 1, fcmTokens: 1 } },
      )
      .toArray();
    const adminIds = admins.map((a) => a._id);
    const tokenSet = new Set();

    const adminTokens = await db
      .collection('device_tokens')
      .find({
        userId: { $in: adminIds },
        role: 'admin',
        canManageOrders: true,
        'preferences.allowAdminNewOrders': { $ne: false },
      })
      .toArray();

    adminTokens.forEach((row) => {
      if (row?.token) tokenSet.add(String(row.token));
    });

    admins.forEach((adminUser) => {
      if (Array.isArray(adminUser?.fcmTokens)) {
        adminUser.fcmTokens.forEach((token) => {
          if (token) tokenSet.add(String(token));
        });
      }
    });

    const tokens = Array.from(tokenSet).filter(Boolean);
    if (tokens.length > 0) {
      const title = payload.locale === 'ar' ? 'طلب جديد' : 'New Order';
      const body = payload.locale === 'ar'
        ? `تم إنشاء طلب جديد ${orderDoc.orderNumber}`
        : `A new order ${orderDoc.orderNumber} was created`;
      await sendToTokens(tokens, {
        notification: { title, body },
        data: {
          title,
          body,
          orderNumber: orderDoc.orderNumber,
          click_action_url: 'https://new.mabcoonline.com/account/admin/orders',
        },
      });
    }
  } catch (err) {
    console.warn('[orders] admin notification failed', err);
  }

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
