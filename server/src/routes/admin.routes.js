const express = require('express');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');
const { requireAdminToken } = require('../middleware/adminTokenAuth');
const { posSyncToken, posSyncConnString } = require('../config/env');
const { syncPosProducts } = require('../services/posProductsSync.service');
const { sendToTokens } = require('../services/fcm');
const { normalizePhone } = require('../utils/phone');
const { validateProductContent } = require('../utils/productContentValidation');

const router = express.Router();

const DEFAULT_SAVED_SPEC_TITLES = [
  { id: 'processor', nameEn: 'Processor', nameAr: 'المعالج', icon: 'Cpu', usageCount: 50, category: 'performance' },
  { id: 'ram', nameEn: 'RAM', nameAr: 'الذاكرة العشوائية', icon: 'MemoryStick', usageCount: 48, category: 'performance' },
  { id: 'storage', nameEn: 'Storage', nameAr: 'التخزين', icon: 'HardDrive', usageCount: 47, category: 'storage' },
  { id: 'display', nameEn: 'Display', nameAr: 'الشاشة', icon: 'Monitor', usageCount: 45, category: 'display' },
  { id: 'camera', nameEn: 'Camera', nameAr: 'الكاميرا', icon: 'Camera', usageCount: 42, category: 'camera' },
  { id: 'battery', nameEn: 'Battery', nameAr: 'البطارية', icon: 'Battery', usageCount: 40, category: 'battery' },
  { id: 'charging', nameEn: 'Charging', nameAr: 'الشحن', icon: 'Zap', usageCount: 38, category: 'charging' },
  { id: 'connectivity', nameEn: 'Connectivity', nameAr: 'الاتصال', icon: 'Wifi', usageCount: 35, category: 'connectivity' },
  { id: 'audio', nameEn: 'Audio', nameAr: 'الصوت', icon: 'Speaker', usageCount: 30, category: 'audio' },
  { id: 'protection', nameEn: 'Protection', nameAr: 'الحماية', icon: 'Shield', usageCount: 28, category: 'protection' },
  { id: 'os', nameEn: 'Operating System', nameAr: 'نظام التشغيل', icon: 'Smartphone', usageCount: 25, category: 'software' },
  { id: 'weight', nameEn: 'Weight', nameAr: 'الوزن', icon: 'Package', usageCount: 22, category: 'physical' },
  { id: 'dimensions', nameEn: 'Dimensions', nameAr: 'الأبعاد', icon: 'Package', usageCount: 20, category: 'physical' },
  { id: 'gpu', nameEn: 'Graphics', nameAr: 'معالج الرسوميات', icon: 'Monitor', usageCount: 18, category: 'performance' },
  { id: 'refresh-rate', nameEn: 'Refresh Rate', nameAr: 'معدل التحديث', icon: 'Monitor', usageCount: 15, category: 'display' },
];

function normalizeSpecTitleText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeSpecTitleKey(value) {
  return normalizeSpecTitleText(value).toLowerCase();
}

function hashIconImage(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  return crypto.createHash('sha1').update(normalized).digest('hex');
}

async function ensureSavedSpecTitleSeed(database) {
  const collection = database.collection('saved_spec_titles');
  const existingCount = await collection.countDocuments();
  if (existingCount > 0) return;

  const now = new Date();
  const docs = DEFAULT_SAVED_SPEC_TITLES.map((item) => ({
    name: {
      en: item.nameEn,
      ar: item.nameAr,
    },
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    nameEnNormalized: normalizeSpecTitleKey(item.nameEn),
    icon: item.icon,
    iconImage: '',
    iconImageHash: '',
    usageCount: item.usageCount,
    category: item.category,
    status: { isActive: true },
    audit: {
      createdAt: now,
      updatedAt: now,
    },
  }));

  await collection.insertMany(docs);
}

function requirePosSyncToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const headerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';
  const token = req.headers['x-pos-sync-token'] || headerToken;

  if (!posSyncToken) {
    return res.status(500).json({ success: false, message: 'POS sync token not configured' });
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'POS sync token required' });
  }
  if (String(token) !== String(posSyncToken)) {
    return res.status(403).json({ success: false, message: 'Invalid POS sync token' });
  }
  return next();
}

function toObjectIdArray(values = []) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (ObjectId.isValid(String(value)) ? new ObjectId(String(value)) : null))
    .filter(Boolean);
}

function normalizeBsonLike(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeBsonLike);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  if ('$date' in value) {
    const raw = value.$date;
    const dateVal = typeof raw === 'number' ? new Date(raw) : new Date(String(raw));
    return Number.isFinite(dateVal.getTime()) ? dateVal : null;
  }
  if ('$oid' in value) {
    return String(value.$oid);
  }
  const next = {};
  for (const [key, val] of Object.entries(value)) {
    next[key] = normalizeBsonLike(val);
  }
  return next;
}

function toDateValue(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  return null;
}

function normalizeOfferPayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const offerType = raw.offer_type || raw.type;
  const offerNo = raw.offer_no != null ? String(raw.offer_no) : '';
  const discountTypeRaw = String(raw.discount_type || raw.discountType || '').toLowerCase();
  const discountType = discountTypeRaw === 'p' || discountTypeRaw === 'percentage' ? 'p' : 'v';
  const isActiveRaw = raw.is_active ?? raw.isActive ?? raw.active;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : String(isActiveRaw || '').toUpperCase() === 'Y';
  const start = toDateValue(raw.start || raw.startsAt);
  const end = toDateValue(raw.end || raw.endsAt);
  const products = Array.isArray(raw.products)
    ? raw.products
        .map((item) => (typeof item === 'string' ? item : item?.stk_code || item?.id || ''))
        .filter(Boolean)
        .map((item) => String(item))
    : [];

  if (!offerType || !offerNo) return null;

  return {
    offer_no: offerNo,
    offer_type: offerType,
    discount: Number(raw.discount ?? raw.discountValue ?? raw.couponValue ?? raw.discountPercentage ?? 0),
    discount_type: discountType,
    title: raw.title || raw.titleEn || '',
    title_ar: raw.title_ar || raw.titleAr || '',
    description: raw.description || raw.descriptionEn || '',
    description_ar: raw.description_ar || raw.descriptionAr || '',
    products,
    start: start || raw.start,
    end: end || raw.end,
    is_active: isActive,
  };
}

function normalizeOffersArray(raw) {
  if (!Array.isArray(raw)) return raw;
  return raw.map(normalizeOfferPayload).filter(Boolean);
}

router.get('/users', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.role) query.role = req.query.role;

  const items = await db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('users', items) });
}));

router.get('/users/:id/permissions', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const user = await db.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { email: 1, role: 1, adminMeta: 1 } },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const adminMeta = user.adminMeta || {};
  res.json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: {
        allowAllCategories: Boolean(adminMeta.allowAllCategories),
        allowAllBrands: Boolean(adminMeta.allowAllBrands),
        allowedCategoryIds: adminMeta.allowedCategoryIds || [],
        allowedBrandIds: adminMeta.allowedBrandIds || [],
        isSuspended: Boolean(adminMeta.isSuspended),
        canManageOrders: Boolean(adminMeta.canManageOrders),
        canManageBanners: Boolean(adminMeta.canManageBanners),
      },
    },
  });
}));

router.put('/users/:id/permissions', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  try {
    const allowAllCategories = Boolean(req.body.allowAllCategories);
    const allowAllBrands = Boolean(req.body.allowAllBrands);
    const allowedCategoryIds = Array.isArray(req.body.allowedCategoryIds)
      ? req.body.allowedCategoryIds.map((v) => String(v))
      : [];
    const allowedBrandIds = Array.isArray(req.body.allowedBrandIds)
      ? req.body.allowedBrandIds.map((v) => String(v))
      : [];
    const isSuspended = req.body.isSuspended === undefined ? undefined : Boolean(req.body.isSuspended);
    const canManageOrders = Boolean(req.body.canManageOrders);
    const canManageBanners = Boolean(req.body.canManageBanners);

    const setDoc = {
      'adminMeta.allowAllCategories': allowAllCategories,
      'adminMeta.allowAllBrands': allowAllBrands,
      'adminMeta.allowedCategoryIds': allowAllCategories ? [] : allowedCategoryIds,
      'adminMeta.allowedBrandIds': allowAllBrands ? [] : allowedBrandIds,
    };
    if (isSuspended !== undefined) {
      setDoc['adminMeta.isSuspended'] = isSuspended;
    }
    setDoc['adminMeta.canManageOrders'] = canManageOrders;
    setDoc['adminMeta.canManageBanners'] = canManageBanners;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: setDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { email: 1, role: 1, adminMeta: 1 } }
    );

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('[admin.users.permissions] failed', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const payload = req.body || {};
  const updates = {};

  if (payload.role) {
    if (!['customer', 'admin', 'super_admin'].includes(String(payload.role))) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    updates.role = String(payload.role);
  }

  if (payload.adminMeta && typeof payload.adminMeta === 'object') {
    const adminMeta = payload.adminMeta || {};
    const allowAllCategories = Boolean(adminMeta.allowAllCategories);
    const allowAllBrands = Boolean(adminMeta.allowAllBrands);
    const allowedCategoryIds = Array.isArray(adminMeta.allowedCategoryIds)
      ? adminMeta.allowedCategoryIds.map((v) => String(v))
      : [];
    const allowedBrandIds = Array.isArray(adminMeta.allowedBrandIds)
      ? adminMeta.allowedBrandIds.map((v) => String(v))
      : [];

    updates['adminMeta.allowAllCategories'] = allowAllCategories;
    updates['adminMeta.allowAllBrands'] = allowAllBrands;
    updates['adminMeta.allowedCategoryIds'] = allowAllCategories ? [] : allowedCategoryIds;
    updates['adminMeta.allowedBrandIds'] = allowAllBrands ? [] : allowedBrandIds;
    if (adminMeta.isSuspended !== undefined) {
      updates['adminMeta.isSuspended'] = Boolean(adminMeta.isSuspended);
    }
    updates['adminMeta.canManageOrders'] = Boolean(adminMeta.canManageOrders);
    updates['adminMeta.canManageBanners'] = Boolean(adminMeta.canManageBanners);
  }

  if (Object.keys(updates).length == 0) {
    return res.status(400).json({ success: false, message: 'No updates provided' });
  }

  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  if (result.matchedCount == 0) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const updatedUser = await db.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { email: 1, role: 1, adminMeta: 1 } }
  );

  return res.json({ success: true, data: updatedUser });
}));

// endpoint to change role for a user (promote/demote)
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { role } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }
  if (!['customer','admin','super_admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  const updateResult = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );
  if (updateResult.matchedCount === 0) {
    console.warn('[admin.users.role] user not found', id);
    return res.status(404).json({ success: false, message: `User not found: ${id}` });
  }
  const updatedUser = await db.collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { email:1, role:1, adminMeta:1 } }
  );
  res.json({ success: true, data: updatedUser });
}));

router.get('/saved-spec-titles', asyncHandler(async (req, res) => {
  const db = getDb();
  await ensureSavedSpecTitleSeed(db);
  const items = await db
    .collection('saved_spec_titles')
    .find({ $or: [{ 'status.isActive': { $ne: false } }, { status: { $exists: false } }] })
    .sort({ usageCount: -1, 'audit.updatedAt': -1, nameEn: 1 })
    .limit(500)
    .toArray();

  res.json({ success: true, data: hydrateCollection('saved_spec_titles', items) });
}));

router.post('/saved-spec-titles', asyncHandler(async (req, res) => {
  const db = getDb();
  const nameEn = normalizeSpecTitleText(req.body?.nameEn);
  const nameAr = normalizeSpecTitleText(req.body?.nameAr);
  const icon = normalizeSpecTitleText(req.body?.icon);
  const iconImage = String(req.body?.iconImage || '').trim();
  const category = normalizeSpecTitleText(req.body?.category);

  if (!nameEn || !nameAr) {
    return res.status(400).json({ success: false, message: 'nameEn and nameAr are required' });
  }

  const now = new Date();
  const nameEnNormalized = normalizeSpecTitleKey(nameEn);
  const iconImageHash = hashIconImage(iconImage);
  const existing = await db.collection('saved_spec_titles').findOne({ nameEnNormalized });

  if (existing) {
    const updates = {
      name: {
        en: nameEn,
        ar: nameAr,
      },
      nameEn,
      nameAr,
      usageCount: Number(existing.usageCount || 0) + 1,
      'audit.updatedAt': now,
      'status.isActive': true,
    };
    if (icon) updates.icon = icon;
    if (iconImage) {
      updates.iconImage = iconImage;
      updates.iconImageHash = iconImageHash;
    }
    if (category) updates.category = category;

    await db.collection('saved_spec_titles').updateOne(
      { _id: existing._id },
      { $set: updates },
    );

    const updated = await db.collection('saved_spec_titles').findOne({ _id: existing._id });
    return res.json({ success: true, data: hydrateDocument('saved_spec_titles', updated) });
  }

  const doc = {
    name: {
      en: nameEn,
      ar: nameAr,
    },
    nameEn,
    nameAr,
    nameEnNormalized,
    icon: icon || '',
    iconImage: iconImage || '',
    iconImageHash: iconImageHash || '',
    usageCount: 1,
    category: category || '',
    status: { isActive: true },
    audit: {
      createdAt: now,
      updatedAt: now,
    },
  };

  const result = await db.collection('saved_spec_titles').insertOne(doc);
  const saved = await db.collection('saved_spec_titles').findOne({ _id: result.insertedId });
  res.status(201).json({ success: true, data: hydrateDocument('saved_spec_titles', saved) });
}));

router.post('/saved-spec-titles/custom-icon', asyncHandler(async (req, res) => {
  const db = getDb();
  const iconImage = String(req.body?.iconImage || '').trim();

  if (!iconImage) {
    return res.status(400).json({ success: false, message: 'iconImage is required' });
  }

  const iconImageHash = hashIconImage(iconImage);
  const now = new Date();
  const existing = await db.collection('saved_spec_titles').findOne({ iconImageHash });

  if (existing) {
    await db.collection('saved_spec_titles').updateOne(
      { _id: existing._id },
      {
        $set: {
          iconImage,
          iconImageHash,
          'status.isActive': true,
          'audit.updatedAt': now,
        },
        $inc: { usageCount: 1 },
      },
    );
    const updated = await db.collection('saved_spec_titles').findOne({ _id: existing._id });
    return res.json({ success: true, data: hydrateDocument('saved_spec_titles', updated) });
  }

  const existingCount = await db.collection('saved_spec_titles').countDocuments({ category: 'custom_icon' });
  const sequence = existingCount + 1;
  const doc = {
    name: {
      en: `Custom Icon ${sequence}`,
      ar: `أيقونة مخصصة ${sequence}`,
    },
    nameEn: `Custom Icon ${sequence}`,
    nameAr: `أيقونة مخصصة ${sequence}`,
    nameEnNormalized: `custom-icon-${sequence}-${now.getTime()}`,
    icon: '',
    iconImage,
    iconImageHash,
    usageCount: 1,
    category: 'custom_icon',
    status: { isActive: true },
    audit: {
      createdAt: now,
      updatedAt: now,
    },
  };

  const result = await db.collection('saved_spec_titles').insertOne(doc);
  const saved = await db.collection('saved_spec_titles').findOne({ _id: result.insertedId });
  res.status(201).json({ success: true, data: hydrateDocument('saved_spec_titles', saved) });
}));

router.post('/saved-spec-titles/:id/usage', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid saved spec title id' });
  }

  await db.collection('saved_spec_titles').updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { usageCount: 1 },
      $set: {
        'audit.updatedAt': new Date(),
        'status.isActive': true,
      },
    },
  );

  const updated = await db.collection('saved_spec_titles').findOne({ _id: new ObjectId(id) });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Saved spec title not found' });
  }

  res.json({ success: true, data: hydrateDocument('saved_spec_titles', updated) });
}));

router.delete('/saved-spec-titles/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid saved spec title id' });
  }

  const result = await db.collection('saved_spec_titles').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return res.status(404).json({ success: false, message: 'Saved spec title not found' });
  }

  res.json({ success: true, data: { id } });
}));

router.get('/orders', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const items = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('orders', items) });
}));

router.put('/orders/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const payload = req.body || {};

  const query = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { orderNumber: String(id) };

  const existing = await db.collection('orders').findOne(query);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const actorUserIdRaw = req.headers['x-admin-user-id'] || payload.actorUserId;
  const actorNameRaw = req.headers['x-admin-user-name'] || payload.actorName;
  const actorUserId = ObjectId.isValid(String(actorUserIdRaw || ''))
    ? new ObjectId(String(actorUserIdRaw))
    : null;

  const updates = {};
  const now = new Date();

  const statusChanged = Boolean(payload.status && payload.status !== existing.status);
  if (payload.status) {
    updates.status = payload.status;
  }

  const incomingInvoice = payload.invoiceNo || payload.inv_no;
  if (incomingInvoice) {
    const inv = String(incomingInvoice);
    updates.invoiceNo = inv;
    updates.inv_no = inv;
  }

  if (payload.shippingFee !== undefined) {
    const shippingFee = Number(payload.shippingFee);
    if (Number.isFinite(shippingFee)) {
      updates['pricing.shipping'] = shippingFee;
    }
  }

  if (payload.shippingPaidBy) {
    updates['pricing.shippingPaidBy'] = payload.shippingPaidBy;
  }

  if (payload.status) {
    const history = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
    history.push({
      status: payload.status,
      date: now,
      note: payload.note || undefined,
      actorUserId: actorUserId || undefined,
      actorName: actorNameRaw ? String(actorNameRaw) : undefined,
    });
    updates.statusHistory = history;
  }

  if (actorUserId || actorNameRaw) {
    updates.lastEditedBy = {
      userId: actorUserId || undefined,
      name: actorNameRaw ? String(actorNameRaw) : undefined,
      at: now,
    };
  }

  const subtotal = Number(existing?.pricing?.subtotal || 0);
  const discount = Number(existing?.pricing?.discount || 0);
  const shipping = updates['pricing.shipping'] ?? existing?.pricing?.shipping ?? 0;
  const shippingPaidBy = updates['pricing.shippingPaidBy'] ?? existing?.pricing?.shippingPaidBy ?? null;
  const shippingContribution = shippingPaidBy === 'customer' ? Number(shipping) : 0;
  updates['pricing.total'] = Math.max(0, subtotal + shippingContribution - discount);

  if (payload.status === 'delivered' && !updates.invoiceNo && !existing.invoiceNo && !existing.inv_no) {
    return res.status(400).json({ success: false, message: 'Invoice number is required for delivered orders.' });
  }

  updates.updatedAt = now;

  await db.collection('orders').updateOne(query, { $set: updates });
  const updated = await db.collection('orders').findOne(query);

  if (statusChanged && updated) {
    const phoneRaw =
      updated?.customerSnapshot?.phone ||
      updated?.customerSnapshot?.secondaryPhone ||
      '';
    const phone = normalizePhone(phoneRaw);
    const tokenSet = new Set(
      Array.isArray(updated?.notificationTokens) ? updated.notificationTokens : [],
    );

    if (tokenSet.size > 0) {
      const tokenRows = await db
        .collection('device_tokens')
        .find({
          token: { $in: Array.from(tokenSet) },
          'preferences.allowOrderUpdates': { $ne: false },
        })
        .toArray();
      tokenSet.clear();
      tokenRows.forEach((row) => {
        if (row?.token) tokenSet.add(String(row.token));
      });
    }

    if (phone) {
      const tokensByPhone = await db
        .collection('device_tokens')
        .find({ phone, 'preferences.allowOrderUpdates': { $ne: false } })
        .toArray();
      tokensByPhone.forEach((row) => {
        if (row?.token) tokenSet.add(String(row.token));
      });
    }

    if (updated?.userId) {
      const tokensByUser = await db
        .collection('device_tokens')
        .find({
          userId: updated.userId,
          'preferences.allowOrderUpdates': { $ne: false },
        })
        .toArray();
      tokensByUser.forEach((row) => {
        if (row?.token) tokenSet.add(String(row.token));
      });

      const userDoc = await db.collection('users').findOne(
        { _id: updated.userId },
        { projection: { fcmTokens: 1 } },
      );
      if (Array.isArray(userDoc?.fcmTokens)) {
        userDoc.fcmTokens.forEach((tok) => {
          if (tok) tokenSet.add(String(tok));
        });
      }
    }

    const tokens = Array.from(tokenSet).filter(Boolean);
     console.log(`[ORDER_STATUS_CHANGE] Order ${updated?.orderNumber || id} status changed to ${payload.status}`);
    console.log(`[ORDER_STATUS_CHANGE] Found ${tokens.length} device tokens for phone ${phone}`);
    
    if (tokens.length > 0) {
      const locale = updated?.locale || 'en';
      const status = String(payload.status);
      const orderNumber = updated?.orderNumber || '';
      const title =
        locale === "ar" ? "تحديث حالة الطلب" : "Order Status Update";
      const body =
        locale === 'ar'
          ? `تم تحديث حالة الطلب ${orderNumber} إلى ${status}`
          : `Your order ${orderNumber} is now ${status}`;
   console.log(`[ORDER_STATUS_CHANGE] Sending notification: "${title}" - "${body}"`);
      console.log(`[ORDER_STATUS_CHANGE] Notification tokens:`, tokens);

      try {
        const notificationResult = await sendToTokens(tokens, {
          notification: { title, body },
          data: {
            title,
            body,
            orderNumber: orderNumber || '',
            status,
            click_action_url: 'https://new.mabcoonline.com/account/orders',
          },
        });
        
        console.log(`[ORDER_STATUS_CHANGE] Notification send result:`, {
          successCount: notificationResult.successCount || 0,
          failureCount: notificationResult.failureCount || 0,
          totalTokens: tokens.length,
          responses: notificationResult.responses?.map((resp, idx) => ({
            tokenIndex: idx,
            success: resp.success,
            error: resp.error?.message || null
          })) || []
        });
        
        if (notificationResult.failureCount > 0) {
          console.warn(`[ORDER_STATUS_CHANGE] Some notifications failed:`, 
            notificationResult.responses?.filter(r => !r.success).map(r => r.error));
        }
        
      } catch (err) {
        console.error('[ORDER_STATUS_CHANGE] FCM send failed with exception:', err);
      }
    } else {
      console.log(`[ORDER_STATUS_CHANGE] No device tokens found - notification not sent`);
    }
  }

  res.json({ success: true, data: hydrateDocument('orders', updated) });
}));

router.get('/notifications', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const items = await db.collection('notifications').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('notifications', items) });
}));

router.get('/reports/daily-kpis', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.date = {};
    if (req.query.from) query.date.$gte = new Date(req.query.from);
    if (req.query.to) query.date.$lte = new Date(req.query.to);
  }

  const data = await db.collection('report_daily_kpis').find(query).sort({ date: 1 }).toArray();
  res.json({ success: true, data: hydrateCollection('report_daily_kpis', data) });
}));

router.get('/actions', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.targetType) query.targetType = req.query.targetType;
  if (req.query.actionType) query.actionType = req.query.actionType;
  if (req.query.actorUserId && ObjectId.isValid(req.query.actorUserId)) {
    query.actorUserId = new ObjectId(req.query.actorUserId);
  }

  const [items, total] = await Promise.all([
    db.collection('admin_actions').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    db.collection('admin_actions').countDocuments(query),
  ]);

  res.json({
    success: true,
    data: hydrateCollection('admin_actions', items),
    pagination: { page, limit, total },
  });
}));

router.post('/pos/sync-products', requirePosSyncToken, asyncHandler(async (req, res) => {
  const db = getDb();
  const connString = posSyncConnString || req.body?.connString;

  if (!connString) {
    return res.status(400).json({ success: false, message: 'POS connection string required' });
  }

  const result = await syncPosProducts({ connString, db, logger: console });
  res.json({ success: true, data: result });
}));

router.get('/products', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
  const skip = (page - 1) * limit;
  const onlyMissing = req.query.missing === '1' || req.query.missing === 'true';
  const onlyComplete = req.query.missing === '0' || req.query.missing === 'false';
  const search = String(req.query.search || '').trim().toLowerCase();

  const query = {};
  if (req.query.cat_code) query.cat_code = String(req.query.cat_code);
  if (req.query.brand_code) query.brand_code = String(req.query.brand_code);
  if (search) {
    query.$or = [
      { stk_code: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { nameAr: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const items = await db
    .collection('products')
    .find(query)
    .sort({ updatedAt: -1 })
    .toArray();

  const mapped = items.map((item) => {
    const product = hydrateDocument('products', item);
    const validation = validateProductContent(product);
    return {
      ...product,
      _missing: validation.missing,
      _hasMissing: validation.hasMissing,
      _validation: {
        product: validation.productMissing,
        variants: {
          colors: {
            total: validation.variants.colors.total,
            completeCount: validation.variants.colors.complete.length,
            incomplete: validation.variants.colors.incomplete.map((entry) => ({
              index: entry.index,
              key: entry.key,
              label: entry.label,
              labelAr: entry.labelAr,
              missing: entry.missing,
            })),
          },
          charges: {
            total: validation.variants.charges.total,
            completeCount: validation.variants.charges.complete.length,
            incomplete: validation.variants.charges.incomplete.map((entry) => ({
              index: entry.index,
              key: entry.key,
              label: entry.label,
              labelAr: entry.labelAr,
              missing: entry.missing,
            })),
          },
        },
        isCatalogReady: validation.isCatalogReady,
      },
    };
  });

  const filtered = onlyMissing
    ? mapped.filter((item) => item._hasMissing)
    : onlyComplete
      ? mapped.filter((item) => !item._hasMissing)
      : mapped;
  const paged = filtered.slice(skip, skip + limit);

  res.json({
    success: true,
    data: paged,
    pagination: { page, limit, total: filtered.length },
  });
}));

router.put('/products/json', requireAdminToken, asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = normalizeBsonLike(req.body || {});
  const requestId = Math.random().toString(36).substr(2, 9);

  const stripUndefined = (obj) => {
    const cleaned = {};
    Object.entries(obj || {}).forEach(([key, val]) => {
      if (val === undefined) return;
      cleaned[key] = val;
    });
    return cleaned;
  };

  const identifier =
    payload.stk_code ||
    payload.id ||
    payload.slug ||
    payload._id ||
    null;

  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Missing product identifier' });
  }

  const query = ObjectId.isValid(String(identifier))
    ? { _id: new ObjectId(String(identifier)) }
    : {
        $or: [
          { stk_code: String(identifier) },
          { id: String(identifier) },
          { slug: String(identifier) },
        ],
      };

  const updates = stripUndefined({ ...payload });
  delete updates._id;

  const now = new Date();
  updates.updatedAt = now;
  if (typeof updates.audit === 'undefined') {
    updates['audit.updatedAt'] = now;
  }

  if (updates.offers !== undefined) {
    updates.offers = normalizeOffersArray(updates.offers);
  }
  if (Array.isArray(updates.colorVariants)) {
    updates.colorVariants = updates.colorVariants.map((variant) => ({
      ...variant,
      offers: normalizeOffersArray(variant?.offers),
    }));
  }
  if (Array.isArray(updates.chargeOptions)) {
    updates.chargeOptions = updates.chargeOptions.map((opt) => ({
      ...opt,
      offers: normalizeOffersArray(opt?.offers),
    }));
  }

  try {
    const existing = await db.collection('products').findOne(query);
    if (!existing) {
      updates.createdAt = now;
      if (typeof updates.audit === 'undefined') {
        updates['audit.createdAt'] = now;
      }
    }

    if (Array.isArray(updates.colorVariants) && existing) {
      const existingVariants = Array.isArray(existing.colorVariants) ? existing.colorVariants : [];
      const byCode = new Map(
        updates.colorVariants
          .filter((v) => v && (v.stk_code || v.stkCode))
          .map((v) => [String(v.stk_code || v.stkCode), v]),
      );
      updates.colorVariants = existingVariants.map((variant) => {
        const code = String(variant?.stk_code || variant?.stkCode || '');
        if (!code || !byCode.has(code)) return variant;
        const incoming = byCode.get(code);
        const next = { ...variant };
        if (incoming.active !== undefined) next.active = incoming.active;
        if (incoming.images !== undefined) next.images = incoming.images;
        if (incoming.image !== undefined) next.image = incoming.image;
        if (incoming.price !== undefined) next.price = incoming.price;
        if (incoming.color_name !== undefined) next.color_name = incoming.color_name;
        if (incoming.color_name_ar !== undefined) next.color_name_ar = incoming.color_name_ar;
        if (incoming.color_hex !== undefined) next.color_hex = incoming.color_hex;
        return next;
      });
    }

    if (Array.isArray(updates.chargeOptions) && existing) {
      const existingOptions = Array.isArray(existing.chargeOptions) ? existing.chargeOptions : [];
      const byCode = new Map(
        updates.chargeOptions
          .filter((o) => o && (o.stk_code || o.stkCode))
          .map((o) => [String(o.stk_code || o.stkCode), o]),
      );
      updates.chargeOptions = existingOptions.map((opt) => {
        const code = String(opt?.stk_code || opt?.stkCode || '');
        if (!code || !byCode.has(code)) return opt;
        const incoming = byCode.get(code);
        const next = { ...opt };
        if (incoming.active !== undefined) next.active = incoming.active;
        if (incoming.in_stock !== undefined) next.in_stock = incoming.in_stock;
        if (incoming.price !== undefined) next.price = incoming.price;
        if (incoming.name !== undefined) next.name = incoming.name;
        if (incoming.name_ar !== undefined) next.name_ar = incoming.name_ar;
        return next;
      });
    }

    await db.collection('products').updateOne(query, { $set: updates }, { upsert: true });
    const updated = await db.collection('products').findOne(query);
    if (updated) {
      await db.collection('admin_actions').insertOne({
        actorUserId: req.adminToken?.userId || new ObjectId('000000000000000000000000'),
        actorRole: 'admin',
        actionType: 'product_json_upsert',
        targetType: 'product',
        targetId: updated._id,
        createdAt: new Date(),
        meta: {
          source: 'pos',
          identifier: String(identifier),
        },
      });
    }
    res.json({ success: true, data: hydrateDocument('products', updated) });
  } catch (err) {
    console.error('[admin.products.json] failed', err);
    return res.status(500).json({ success: false, message: err?.message || 'Failed to update product' });
  }
}));

router.put('/products/json/bulk', requireAdminToken, asyncHandler(async (req, res) => {
  const db = getDb();
  const items = Array.isArray(req.body) ? req.body : req.body?.items;
  const requestId = Math.random().toString(36).substr(2, 9);

  const stripUndefined = (obj) => {
    const cleaned = {};
    Object.entries(obj || {}).forEach(([key, val]) => {
      if (val === undefined) return;
      cleaned[key] = val;
    });
    return cleaned;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items provided' });
  }

  const now = new Date();
  const results = [];
  for (const rawPayload of items) {
    const payload = normalizeBsonLike(rawPayload || {});
    const identifier =
      payload?.stk_code ||
      payload?.id ||
      payload?.slug ||
      payload?._id ||
      null;
    if (!identifier) {
      results.push({ success: false, message: 'Missing product identifier', payload });
      continue;
    }

    const query = ObjectId.isValid(String(identifier))
      ? { _id: new ObjectId(String(identifier)) }
      : {
          $or: [
            { stk_code: String(identifier) },
            { id: String(identifier) },
            { slug: String(identifier) },
          ],
        };

    const updates = stripUndefined({ ...payload });
    delete updates._id;
    updates.updatedAt = now;
    if (typeof updates.audit === 'undefined') {
      updates['audit.updatedAt'] = now;
    }

    if (updates.offers !== undefined) {
      updates.offers = normalizeOffersArray(updates.offers);
    }
    if (Array.isArray(updates.colorVariants)) {
      updates.colorVariants = updates.colorVariants.map((variant) => ({
        ...variant,
        offers: normalizeOffersArray(variant?.offers),
      }));
    }
    if (Array.isArray(updates.chargeOptions)) {
      updates.chargeOptions = updates.chargeOptions.map((opt) => ({
        ...opt,
        offers: normalizeOffersArray(opt?.offers),
      }));
    }

    const existing = await db.collection('products').findOne(query);
    if (!existing) {
      updates.createdAt = now;
      if (typeof updates.audit === 'undefined') {
        updates['audit.createdAt'] = now;
      }
    }

    if (Array.isArray(updates.colorVariants) && existing) {
      const existingVariants = Array.isArray(existing.colorVariants) ? existing.colorVariants : [];
      const byCode = new Map(
        updates.colorVariants
          .filter((v) => v && (v.stk_code || v.stkCode))
          .map((v) => [String(v.stk_code || v.stkCode), v]),
      );
      updates.colorVariants = existingVariants.map((variant) => {
        const code = String(variant?.stk_code || variant?.stkCode || '');
        if (!code || !byCode.has(code)) return variant;
        const incoming = byCode.get(code);
        const next = { ...variant };
        if (incoming.active !== undefined) next.active = incoming.active;
        if (incoming.images !== undefined) next.images = incoming.images;
        if (incoming.image !== undefined) next.image = incoming.image;
        if (incoming.price !== undefined) next.price = incoming.price;
        if (incoming.color_name !== undefined) next.color_name = incoming.color_name;
        if (incoming.color_name_ar !== undefined) next.color_name_ar = incoming.color_name_ar;
        if (incoming.color_hex !== undefined) next.color_hex = incoming.color_hex;
        return next;
      });
    }

    if (Array.isArray(updates.chargeOptions) && existing) {
      const existingOptions = Array.isArray(existing.chargeOptions) ? existing.chargeOptions : [];
      const byCode = new Map(
        updates.chargeOptions
          .filter((o) => o && (o.stk_code || o.stkCode))
          .map((o) => [String(o.stk_code || o.stkCode), o]),
      );
      updates.chargeOptions = existingOptions.map((opt) => {
        const code = String(opt?.stk_code || opt?.stkCode || '');
        if (!code || !byCode.has(code)) return opt;
        const incoming = byCode.get(code);
        const next = { ...opt };
        if (incoming.active !== undefined) next.active = incoming.active;
        if (incoming.in_stock !== undefined) next.in_stock = incoming.in_stock;
        if (incoming.price !== undefined) next.price = incoming.price;
        if (incoming.name !== undefined) next.name = incoming.name;
        if (incoming.name_ar !== undefined) next.name_ar = incoming.name_ar;
        return next;
      });
    }

    try {
      await db.collection('products').updateOne(query, { $set: updates }, { upsert: true });
      const updated = await db.collection('products').findOne(query);
      if (updated) {
        await db.collection('admin_actions').insertOne({
          actorUserId: req.adminToken?.userId || new ObjectId('000000000000000000000000'),
          actorRole: 'admin',
          actionType: 'product_json_upsert',
          targetType: 'product',
          targetId: updated._id,
          createdAt: new Date(),
          meta: {
            source: 'pos',
            identifier: String(identifier),
            bulk: true,
          },
        });
      }
      results.push({ success: true, identifier });
    } catch (err) {
      console.error('[admin.products.json.bulk] failed item', { identifier, err });
      results.push({ success: false, identifier, error: err?.message || 'Failed to update product' });
    }
  }

  res.json({ success: true, data: { count: results.length, results } });
}));

router.put('/products/:id', asyncHandler(async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const query = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : {
        $or: [
          { stk_code: String(id) },
          { id: String(id) },
          { slug: String(id) },
        ],
      };

  const existing = await db.collection('products').findOne(query);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const payload = req.body || {};
  const updates = {};
  const setIfDefined = (key, value) => {
    if (value !== undefined) updates[key] = value;
  };

  setIfDefined('name', payload.name);
  setIfDefined('nameAr', payload.nameAr);
  if (payload.descriptionEn !== undefined) setIfDefined('description', payload.descriptionEn);
  else setIfDefined('description', payload.description);
  setIfDefined('descriptionAr', payload.descriptionAr);
  setIfDefined('image', payload.image);
  setIfDefined('images', payload.images);
  setIfDefined('category', payload.category);
  setIfDefined('categoryAr', payload.categoryAr);
  setIfDefined('cat_code', payload.cat_code);
  setIfDefined('brand', payload.brand);
  setIfDefined('brand_code', payload.brand_code);
  setIfDefined('inTheBox', payload.inTheBox);
  if (payload.status && typeof payload.status === 'object') {
    if (payload.status.isHidden !== undefined) {
      updates['status.isHidden'] = Boolean(payload.status.isHidden);
    }
    if (payload.status.isActive !== undefined) {
      updates['status.isActive'] = Boolean(payload.status.isActive);
    }
  }
  if (payload.availability && typeof payload.availability === 'object') {
    if (payload.availability.hiddenReason !== undefined) {
      updates['availability.hiddenReason'] = payload.availability.hiddenReason || '';
    }
    if (payload.availability.isAvailable !== undefined) {
      updates['availability.isAvailable'] = Boolean(payload.availability.isAvailable);
    }
  }
  if (payload.specs !== undefined) {
    updates.specs = Array.isArray(payload.specs) ? payload.specs.map(spec => ({
      icon: spec.iconImage ? { type: 'url', url: spec.iconImage } : { type: 'react_icon', key: spec.icon || 'Smartphone' },
      title: spec.title || spec.nameEn || '',
      titleAr: spec.titleAr || spec.nameAr || spec.title || '',
      value: spec.value || spec.valueEn || '',
      valueAr: spec.valueAr || spec.valueAr || spec.value || '',
    })) : payload.specs;
  }

  if (Array.isArray(payload.colorVariants)) {
    const existingVariants = Array.isArray(existing.colorVariants) ? existing.colorVariants : [];
    const byCode = new Map(
      payload.colorVariants
        .filter((v) => v && (v.stk_code || v.stkCode))
        .map((v) => [String(v.stk_code || v.stkCode), v]),
    );
    const merged = existingVariants.map((variant) => {
      const variantStkCode = String(variant?.stk_code || variant?.stkCode || '').trim();
      if (!variantStkCode || !byCode.has(variantStkCode)) return variant;
      const match = byCode.get(variantStkCode);
      const hasExplicitImages = Array.isArray(match.images);
      const images = hasExplicitImages
        ? match.images
        : match.image
        ? [match.image]
        : [];
      return {
        ...variant,
        active: typeof match.active === 'boolean' ? match.active : variant.active,
        images: hasExplicitImages ? images : variant.images,
        image: hasExplicitImages ? (images[0] || '') : variant.image,
        price: match.price !== undefined ? match.price : variant.price,
        color_name: match.color_name !== undefined ? match.color_name : variant.color_name,
        color_name_ar: match.color_name_ar !== undefined ? match.color_name_ar : variant.color_name_ar,
        color_hex: match.color_hex !== undefined ? match.color_hex : variant.color_hex,
      };
    });
    updates.colorVariants = merged;
  }

  if (Array.isArray(payload.chargeOptions)) {
    const existingOptions = Array.isArray(existing.chargeOptions) ? existing.chargeOptions : [];
    const byCode = new Map(
      payload.chargeOptions
        .filter((o) => o && (o.stk_code || o.stkCode))
        .map((o) => [String(o.stk_code || o.stkCode), o]),
    );
    const merged = existingOptions.map((opt) => {
      const optCode = String(opt?.stk_code || opt?.stkCode || '').trim();
      if (!optCode || !byCode.has(optCode)) return opt;
      const match = byCode.get(optCode);
      return {
        ...opt,
        active: typeof match.active === 'boolean' ? match.active : opt.active,
        in_stock: match.in_stock !== undefined ? match.in_stock : opt.in_stock,
        price: match.price !== undefined ? match.price : opt.price,
        name: match.name !== undefined ? match.name : opt.name,
        name_ar: match.name_ar !== undefined ? match.name_ar : opt.name_ar,
      };
    });
    updates.chargeOptions = merged;
  }

  updates.updatedAt = new Date();
  if (typeof updates.audit === 'undefined') {
    updates['audit.updatedAt'] = updates.updatedAt;
  }

  try {
    await db.collection('products').updateOne(query, { $set: updates });
  } catch (err) {
    const details = err?.errInfo?.details || null;
    console.error('[admin.products.update] failed', err);
    if (details) {
      console.error('[admin.products.update] validation details', JSON.stringify(details, null, 2));
    }
    return res.status(400).json({
      success: false,
      message: err?.message || 'Failed to update product',
      details,
    });
  }

  const actorUserIdRaw = req.headers['x-admin-user-id'] || payload.actorUserId;
  const actorRole = req.headers['x-admin-role'] || payload.actorRole || 'admin';
  const actorUserId = ObjectId.isValid(String(actorUserIdRaw || ''))
    ? new ObjectId(String(actorUserIdRaw))
    : new ObjectId('000000000000000000000000');

  await db.collection('admin_actions').insertOne({
    actorUserId,
    actorRole: String(actorRole),
    actionType: payload?.status?.isHidden !== undefined ? (payload.status.isHidden ? 'hide' : 'show') : 'product_content_update',
    targetType: 'product',
    targetId: existing._id,
    createdAt: new Date(),
  });

  const updated = await db.collection('products').findOne(query);
  res.json({ success: true, data: hydrateDocument('products', updated) });
}));

router.get('/analytics/visitor-sessions', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.eventAt = {};
    if (req.query.from) query.eventAt.$gte = new Date(req.query.from);
    if (req.query.to) query.eventAt.$lte = new Date(req.query.to);
  }

  const items = await db
    .collection('web_events')
    .find(query)
    .sort({ eventAt: -1 })
    .limit(5000)
    .toArray();

  res.json({ success: true, data: hydrateCollection('web_events', items) });
}));

router.get('/analytics/cart-events', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};

  if (req.query.from || req.query.to) {
    query.eventAt = {};
    if (req.query.from) query.eventAt.$gte = new Date(req.query.from);
    if (req.query.to) query.eventAt.$lte = new Date(req.query.to);
  }

  const items = await db
    .collection('cart_events')
    .find(query)
    .sort({ eventAt: -1 })
    .limit(5000)
    .toArray();

  res.json({ success: true, data: hydrateCollection('cart_events', items) });
}));

router.get('/product-revisions/:productId', asyncHandler(async (req, res) => {
  const db = getDb();
  const { productId } = req.params;

  const query = {};
  if (ObjectId.isValid(productId)) {
    query.productId = new ObjectId(productId);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid productId' });
  }

  const data = await db.collection('product_revisions').find(query).sort({ version: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('product_revisions', data) });
}));

module.exports = router;
