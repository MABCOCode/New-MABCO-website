const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.active === 'true') query.isActive = true;
  if (req.query.type) query.type = req.query.type;

  const now = new Date();
  if (req.query.live === 'true') {
    query['window.startsAt'] = { $lte: now };
    query['window.endsAt'] = { $gte: now };
  }

  const items = await db.collection('offers').find(query).sort({ priority: -1, createdAt: -1 }).toArray();
  res.json({ success: true, data: items });
}));

module.exports = router;
