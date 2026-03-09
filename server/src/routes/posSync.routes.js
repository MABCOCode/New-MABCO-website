const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { syncPosProducts } = require('../services/posSync.service');

const router = express.Router();

async function handleSync(req, res) {
  const connString = process.env.POSS_SQL_CONN_STRING;
  if (!connString) {
    return res.status(500).json({ success: false, message: 'POSS_SQL_CONN_STRING is not set' });
  }

  const db = getDb();
  const result = await syncPosProducts({ connString, db, logger: console });
  return res.json({ success: true, ...result });
}

router.post('/pos-products', asyncHandler(handleSync));
router.get('/pos-products', asyncHandler(handleSync));

module.exports = router;
