const crypto = require('crypto');
const { getDb } = require('../config/db');
const { adminTokenSecret } = require('../config/env');

const hashToken = (token) =>
  crypto
    .createHash('sha256')
    .update(`${token}:${adminTokenSecret || 'admin-token-secret'}`)
    .digest('hex');

async function requireAdminToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const headerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';
  const token = req.headers['x-admin-token'] || headerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin token required' });
  }

  const tokenHash = hashToken(String(token));
  const db = getDb();
  const record = await db.collection('admin_tokens').findOne({ tokenHash });
  if (!record) {
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return res.status(401).json({ success: false, message: 'Admin token expired' });
  }

  req.adminToken = record;
  return next();
}

module.exports = { requireAdminToken, hashToken };
