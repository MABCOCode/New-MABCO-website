const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.active === 'true') query.isActive = true;
  const items = await db.collection('brands').find(query).sort({ sortOrder: 1, 'name.en': 1 }).toArray();
  res.json({ success: true, data: items });
}));

module.exports = router;
