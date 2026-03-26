const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

const normalizePhone = (raw) => {
  if (!raw) return '';
  let digits = String(raw).replace(/[^0-9]/g, '');
  if (digits.startsWith('963')) {
    digits = `0${digits.slice(3)}`;
  }
  return digits;
};

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

  const update = {
    token,
    userId,
    phone: phone || null,
    locale: payload.locale || null,
    platform: payload.platform || 'web',
    lastSeenAt: now,
  };

  await db.collection('device_tokens').updateOne(
    { token },
    { $set: update, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );

  res.json({ success: true });
}));

module.exports = router;
