const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.active === 'true') query.isActive = true;

  const items = await db
    .collection('banner_slides')
    .find(query)
    .sort({ order: 1 })
    .toArray();

  res.json({ success: true, data: items });
}));

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = req.body || {};

  const max = await db
    .collection('banner_slides')
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .toArray();
  const nextId = (max[0]?.id || 0) + 1;

  const doc = {
    id: nextId,
    image: String(payload.image || ''),
    url: payload.url != null ? String(payload.url) : '',
    titleEn: String(payload.titleEn || ''),
    titleAr: String(payload.titleAr || ''),
    subtitleEn: String(payload.subtitleEn || ''),
    subtitleAr: String(payload.subtitleAr || ''),
    buttonTextEn: String(payload.buttonTextEn || ''),
    buttonTextAr: String(payload.buttonTextAr || ''),
    order: Number.isFinite(payload.order) ? payload.order : nextId,
    isActive: typeof payload.isActive === 'boolean' ? payload.isActive : true,
  };

  await db.collection('banner_slides').insertOne(doc);
  res.json({ success: true, data: doc });
}));

router.put('/reorder/all', asyncHandler(async (req, res) => {
  const db = getDb();
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];

  const bulk = ids
    .map((rawId, index) => {
      const id = Number(rawId);
      if (!Number.isFinite(id)) return null;
      return {
        updateOne: {
          filter: { id },
          update: { $set: { order: index + 1 } },
        },
      };
    })
    .filter(Boolean);

  if (bulk.length) {
    await db.collection('banner_slides').bulkWrite(bulk, { ordered: false });
  }

  res.json({ success: true });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  const payload = req.body || {};
  const updates = {};

  if (payload.image != null) updates.image = String(payload.image);
  if (payload.url != null) updates.url = String(payload.url);
  if (payload.titleEn != null) updates.titleEn = String(payload.titleEn);
  if (payload.titleAr != null) updates.titleAr = String(payload.titleAr);
  if (payload.subtitleEn != null) updates.subtitleEn = String(payload.subtitleEn);
  if (payload.subtitleAr != null) updates.subtitleAr = String(payload.subtitleAr);
  if (payload.buttonTextEn != null) updates.buttonTextEn = String(payload.buttonTextEn);
  if (payload.buttonTextAr != null) updates.buttonTextAr = String(payload.buttonTextAr);
  if (payload.order != null && Number.isFinite(payload.order)) updates.order = payload.order;
  if (typeof payload.isActive === 'boolean') updates.isActive = payload.isActive;

  const result = await db
    .collection('banner_slides')
    .findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' },
    );

  res.json({ success: true, data: result.value });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }

  await db.collection('banner_slides').deleteOne({ id });
  res.json({ success: true });
}));

module.exports = router;
