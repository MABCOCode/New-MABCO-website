const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { normalizePhone, phoneVariants } = require('../utils/phone');

const router = express.Router();

router.post('/device-token', asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = req.body || {};
  const token = String(payload.token || '').trim();
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  const userIdRaw = payload.userId || null;
  const userId = userIdRaw && ObjectId.isValid(String(userIdRaw))
    ? new ObjectId(String(userIdRaw))
    : null;

  const phone = normalizePhone(payload.phone || '');
  const now = new Date();
  let role = payload.role ? String(payload.role) : null;
  let canManageOrders = Boolean(payload.canManageOrders);

  if (userId) {
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { role: 1, adminMeta: 1, phone: 1 } },
    );
    if (user) {
      role = user.role || role;
      canManageOrders = Boolean(user?.adminMeta?.canManageOrders);
      if (!phone && user.phone) {
        const normalized = normalizePhone(user.phone);
        if (normalized) {
          payload.phone = normalized;
        }
      }
    }
  }

  let resolvedPhone = normalizePhone(payload.phone || '') || phone || null;

  if (!userId && resolvedPhone) {
    const variants = phoneVariants(resolvedPhone);
    const userByPhone = await db.collection('users').findOne(
      { phone: { $in: variants } },
      { projection: { _id: 1, role: 1, adminMeta: 1, phone: 1 } },
    );
    if (userByPhone) {
      resolvedPhone = normalizePhone(userByPhone.phone || resolvedPhone) || resolvedPhone;
      payload.userId = userByPhone._id;
      if (!role) role = userByPhone.role || null;
      canManageOrders = Boolean(userByPhone?.adminMeta?.canManageOrders);
    }
  }

  const update = {
    token,
    userId: payload.userId ? new ObjectId(String(payload.userId)) : userId,
    phone: resolvedPhone,
    locale: payload.locale || null,
    platform: payload.platform || 'web',
    role: role || null,
    canManageOrders,
    preferences: {
      allowOrderUpdates: payload?.preferences?.allowOrderUpdates ?? true,
      allowAdminNewOrders: payload?.preferences?.allowAdminNewOrders ?? true,
    },
    lastSeenAt: now,
  };

  await db.collection('device_tokens').updateOne(
    { token },
    { $set: update, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );

  if (payload.userId) {
    await db.collection('users').updateOne(
      { _id: new ObjectId(String(payload.userId)) },
      { $addToSet: { fcmTokens: token } },
    );
  }

  res.json({ success: true });
}));

router.post('/device-token/preferences', asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = req.body || {};
  const token = String(payload.token || '').trim();
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  const allowOrderUpdates =
    payload?.preferences?.allowOrderUpdates ?? payload.allowOrderUpdates;
  const allowAdminNewOrders =
    payload?.preferences?.allowAdminNewOrders ?? payload.allowAdminNewOrders;

  const update = {};
  if (allowOrderUpdates !== undefined) {
    update['preferences.allowOrderUpdates'] = Boolean(allowOrderUpdates);
  }
  if (allowAdminNewOrders !== undefined) {
    update['preferences.allowAdminNewOrders'] = Boolean(allowAdminNewOrders);
  }

  if (Object.keys(update).length === 0) {
    return res.status(400).json({ success: false, message: 'No preferences provided' });
  }

  await db.collection('device_tokens').updateOne(
    { token },
    { $set: update, $currentDate: { lastSeenAt: true } },
  );

  res.json({ success: true });
}));

module.exports = router;
