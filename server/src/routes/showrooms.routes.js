const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');

const router = express.Router();

function normalizeShowroomDoc(doc) {
  const loc = doc.location || {};
  const isGeoPoint = loc.type === 'Point' && Array.isArray(loc.coordinates);

  const addressObj = typeof doc.address === 'object' ? doc.address : { en: doc.address || '', ar: doc.address || '' };
  const hoursFromObj = typeof doc.hours?.from === 'object' ? doc.hours.from : { en: doc.hours?.from || '', ar: doc.hours?.from || '' };
  const hoursToObj = typeof doc.hours?.to === 'object' ? doc.hours.to : { en: doc.hours?.to || '', ar: doc.hours?.to || '' };
  const weekEndObj = typeof doc.week_end === 'object' ? doc.week_end : { en: doc.week_end || '', ar: doc.week_end || '' };

  return {
    ...doc,
    Loc_code: doc.code,
    City_name: doc.city?.en || doc.City_name,
    City_name_ar: doc.city?.ar || doc.City_name_ar || doc.city?.en || doc.City_name,
    Loc_name: doc.name?.en || doc.Loc_name,
    Loc_name_ar: doc.name?.ar || doc.Loc_name_ar || doc.name?.en || doc.Loc_name,
    Address: addressObj.en,
    Address_ar: addressObj.ar,
    Winter_from_date: hoursFromObj.en,
    Winter_from_date_ar: hoursFromObj.ar,
    Winter_to_date: hoursToObj.en,
    Winter_to_date_ar: hoursToObj.ar,
    Longitude: isGeoPoint ? String(loc.coordinates[0] || '') : String(loc.longitude || ''),
    Latitude: isGeoPoint ? String(loc.coordinates[1] || '') : String(loc.latitude || ''),
    Image_Link: doc.image_link || doc.Image_Link,
    week_end: weekEndObj.en,
    week_end_ar: weekEndObj.ar,
    Phone: doc.phone || doc.Phone,
    isActive: doc.isActive !== undefined ? doc.isActive : true,
  };
}

router.get('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.active === 'true') query.isActive = true;
  const items = await db.collection('showrooms').find(query).sort({ 'city.en': 1, 'name.en': 1 }).toArray();
  const normalized = items.map(normalizeShowroomDoc);
  res.json({ success: true, data: normalized });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const query = { $or: [{ code: id }] };
  const ObjectId = require('mongodb').ObjectId;
  if (typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)) {
    query.$or.push({ _id: new ObjectId(id) });
  }
  const item = await db.collection('showrooms').findOne(query);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Showroom not found' });
  }
  res.json({ success: true, data: normalizeShowroomDoc(item) });
}));

router.post('/', asyncHandler(async (req, res) => {
  const db = getDb();
  const body = req.body || {};

  const code = String(body.code || body.Loc_code || '').trim();
  if (!code) {
    return res.status(400).json({ success: false, message: 'Showroom code is required' });
  }

  const existing = await db.collection('showrooms').findOne({ code });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Showroom with this code already exists' });
  }

  const lng = parseFloat(String(body.longitude || body.Longitude || '')) || 0;
  const lat = parseFloat(String(body.latitude || body.Latitude || '')) || 0;

  const now = new Date();
  const doc = {
    code,
    name: {
      en: String(body.nameEn || body.name?.en || body.Loc_name || '').trim(),
      ar: String(body.nameAr || body.name?.ar || body.Loc_name || '').trim(),
    },
    city: {
      en: String(body.cityEn || body.city?.en || body.City_name || '').trim(),
      ar: String(body.cityAr || body.city?.ar || body.City_name || '').trim(),
    },
    address: {
      en: String(body.addressEn || body.address?.en || body.Address || '').trim(),
      ar: String(body.addressAr || body.address?.ar || body.Address_ar || '').trim(),
    },
    phone: String(body.phone || body.Phone || '').trim(),
    warranty_type: String(body.warranty_type || '').trim(),
    location: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    hours: {
      from: {
        en: String(body.hoursFromEn || body.hours?.from?.en || body.hoursFrom || '').trim(),
        ar: String(body.hoursFromAr || body.hours?.from?.ar || body.hoursFrom_ar || '').trim(),
      },
      to: {
        en: String(body.hoursToEn || body.hours?.to?.en || body.hoursTo || '').trim(),
        ar: String(body.hoursToAr || body.hours?.to?.ar || body.hoursTo_ar || '').trim(),
      },
    },
    week_end: {
      en: String(body.weekEndEn || body.week_end?.en || body.week_end || '').trim(),
      ar: String(body.weekEndAr || body.week_end?.ar || body.week_end_ar || '').trim(),
    },
    image_link: String(body.image_link || body.Image_Link || '').trim(),
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('showrooms').insertOne(doc);
  const created = await db.collection('showrooms').findOne({ _id: result.insertedId });
  res.status(201).json({ success: true, data: normalizeShowroomDoc(created) });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const body = req.body || {};
  const ObjectId = require('mongodb').ObjectId;

  const query = { $or: [{ code: id }] };
  if (typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)) {
    query.$or.push({ _id: new ObjectId(id) });
  }

  const existing = await db.collection('showrooms').findOne(query);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Showroom not found' });
  }

  const now = new Date();
  const updates = {};

  if (body.code !== undefined) updates.code = String(body.code).trim();

  if (body.nameEn !== undefined || body.name?.en !== undefined) {
    updates['name.en'] = String(body.nameEn || body.name?.en || existing.name?.en || '').trim();
  }
  if (body.nameAr !== undefined || body.name?.ar !== undefined) {
    updates['name.ar'] = String(body.nameAr || body.name?.ar || existing.name?.ar || '').trim();
  }
  if (body.cityEn !== undefined || body.city?.en !== undefined) {
    updates['city.en'] = String(body.cityEn || body.city?.en || existing.city?.en || '').trim();
  }
  if (body.cityAr !== undefined || body.city?.ar !== undefined) {
    updates['city.ar'] = String(body.cityAr || body.city?.ar || existing.city?.ar || '').trim();
  }

  const existingAddress = typeof existing.address === 'object' ? existing.address : { en: existing.address || '', ar: existing.address || '' };
  if (body.addressEn !== undefined || body.address?.en !== undefined) {
    updates['address.en'] = String(body.addressEn || body.address?.en || existingAddress.en || '').trim();
  }
  if (body.addressAr !== undefined || body.address?.ar !== undefined) {
    updates['address.ar'] = String(body.addressAr || body.address?.ar || existingAddress.ar || '').trim();
  }

  if (body.phone !== undefined) updates.phone = String(body.phone).trim();
  if (body.warranty_type !== undefined) updates.warranty_type = String(body.warranty_type).trim();

  const hasLng = body.longitude !== undefined || body.Longitude !== undefined;
  const hasLat = body.latitude !== undefined || body.Latitude !== undefined;
  if (hasLng || hasLat) {
    const existingLoc = existing.location || {};
    const isGeoPoint = existingLoc.type === 'Point' && Array.isArray(existingLoc.coordinates);
    const currentLng = isGeoPoint ? existingLoc.coordinates[0] : parseFloat(existingLoc.longitude) || 0;
    const currentLat = isGeoPoint ? existingLoc.coordinates[1] : parseFloat(existingLoc.latitude) || 0;
    updates.location = {
      type: 'Point',
      coordinates: [
        hasLng ? parseFloat(String(body.longitude || body.Longitude)) || currentLng : currentLng,
        hasLat ? parseFloat(String(body.latitude || body.Latitude)) || currentLat : currentLat,
      ],
    };
  }

  const existingHoursFrom = typeof existing.hours?.from === 'object' ? existing.hours.from : { en: existing.hours?.from || '', ar: existing.hours?.from || '' };
  const existingHoursTo = typeof existing.hours?.to === 'object' ? existing.hours.to : { en: existing.hours?.to || '', ar: existing.hours?.to || '' };
  if (body.hoursFromEn !== undefined || body.hours?.from?.en !== undefined) {
    updates['hours.from.en'] = String(body.hoursFromEn || body.hours?.from?.en || existingHoursFrom.en || '').trim();
  }
  if (body.hoursFromAr !== undefined || body.hours?.from?.ar !== undefined) {
    updates['hours.from.ar'] = String(body.hoursFromAr || body.hours?.from?.ar || existingHoursFrom.ar || '').trim();
  }
  if (body.hoursToEn !== undefined || body.hours?.to?.en !== undefined) {
    updates['hours.to.en'] = String(body.hoursToEn || body.hours?.to?.en || existingHoursTo.en || '').trim();
  }
  if (body.hoursToAr !== undefined || body.hours?.to?.ar !== undefined) {
    updates['hours.to.ar'] = String(body.hoursToAr || body.hours?.to?.ar || existingHoursTo.ar || '').trim();
  }

  const existingWeekEnd = typeof existing.week_end === 'object' ? existing.week_end : { en: existing.week_end || '', ar: existing.week_end || '' };
  if (body.weekEndEn !== undefined || body.week_end?.en !== undefined) {
    updates['week_end.en'] = String(body.weekEndEn || body.week_end?.en || existingWeekEnd.en || '').trim();
  }
  if (body.weekEndAr !== undefined || body.week_end?.ar !== undefined) {
    updates['week_end.ar'] = String(body.weekEndAr || body.week_end?.ar || existingWeekEnd.ar || '').trim();
  }

  if (body.image_link !== undefined || body.Image_Link !== undefined) updates.image_link = String(body.image_link || body.Image_Link).trim();
  if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'No updates provided' });
  }

  updates.updatedAt = now;

  await db.collection('showrooms').updateOne(query, { $set: updates });
  const updated = await db.collection('showrooms').findOne(query);
  res.json({ success: true, data: normalizeShowroomDoc(updated) });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const ObjectId = require('mongodb').ObjectId;

  const query = { $or: [{ code: id }] };
  if (typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)) {
    query.$or.push({ _id: new ObjectId(id) });
  }

  const result = await db.collection('showrooms').deleteOne(query);
  if (result.deletedCount === 0) {
    return res.status(404).json({ success: false, message: 'Showroom not found' });
  }
  res.json({ success: true, data: { id } });
}));

module.exports = router;
