const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection } = require('../models');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.active === 'true') query.is_active = true;
  if (req.query.type) query.offer_type = req.query.type;

  const now = new Date();
  if (req.query.live === 'true') {
    query.start = { $lte: now };
    query.end = { $gte: now };
  }

  const items = await db.collection('offers').find(query).sort({ start: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('offers', items) });
}));

module.exports = router;
