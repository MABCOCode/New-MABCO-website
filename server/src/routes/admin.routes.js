const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');
const { requireAdminToken } = require('../middleware/adminTokenAuth');
const { posSyncToken, posSyncConnString } = require('../config/env');
const { syncPosProducts } = require('../services/posProductsSync.service');
const { sendToTokens } = require('../services/fcm');
const { normalizePhone } = require('../utils/phone');

const router = express.Router();

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

const computeContentMissing = (product) => {
  const name = typeof product?.name === 'object' ? product?.name?.en : product?.name;
  const nameAr = product?.nameAr || (typeof product?.name === 'object' ? product?.name?.ar : '');
  const description = product?.description || '';
  const descriptionAr = product?.descriptionAr || '';
  const image = product?.image || '';
  const specs = Array.isArray(product?.specs) ? product.specs : [];
  const inTheBox = Array.isArray(product?.inTheBox) ? product.inTheBox : [];
  const galleryImages = Array.isArray(product?.images) ? product.images : [];
  const colors = Array.isArray(product?.colorVariants) ? product.colorVariants : [];

  const colorImagesMissing = colors.filter((color) => {
    const nameVal = color?.name || color?.color_name || '';
    const nameArVal = color?.nameAr || color?.color_name_ar || nameVal || '';
    const images = Array.isArray(color?.images)
      ? color.images.map((img) => (typeof img === 'string' ? img : img?.image_link || img?.url || '')).filter(Boolean)
      : [];
    const imageVal = color?.image || images[0] || '';
    return !String(nameVal || nameArVal).trim() || !String(imageVal).trim();
  }).length;

  const hasSpecs = specs.length > 0;
  const hasDescription = String(description).trim().length > 0 || String(descriptionAr).trim().length > 0;
  const hasName = String(name).trim().length > 0 && String(nameAr).trim().length > 0;
  const hasColorImages = colors.some((color) => {
    const images = Array.isArray(color?.images)
      ? color.images.map((img) => (typeof img === 'string' ? img : img?.image_link || img?.url || '')).filter(Boolean)
      : [];
    const imageVal = color?.image || images[0] || '';
    return String(imageVal).trim().length > 0;
  });
  const hasImage = String(image).trim().length > 0 || hasColorImages;
  const hasGallery = galleryImages.length > 0;
  const hasBox = inTheBox.length > 0;
  const hasCategory = String(product?.category || '').trim().length > 0;
  const hasBrand = String(product?.brand || '').trim().length > 0;

  const missing = {
    name: !hasName,
    description: !hasDescription,
    specs: !hasSpecs,
    image: !hasImage,
    colorImages: colorImagesMissing,
    galleryImages: !hasGallery,
    inTheBox: !hasBox,
    category: !hasCategory,
    brand: !hasBrand,
  };

  const hasMissing =
    missing.name ||
    missing.description ||
    missing.specs ||
    missing.image ||
    missing.colorImages > 0 ||
    missing.galleryImages ||
    missing.inTheBox ||
    missing.category ||
    missing.brand;

  return { missing, hasMissing };
};

router.get('/products', asyncHandler(async (req, res) => {
  const db = getDb();
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), 200);
  const skip = (page - 1) * limit;
  const onlyMissing = req.query.missing === '1' || req.query.missing === 'true';
  const search = String(req.query.search || '').trim().toLowerCase();

  const query = {};
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
    .skip(skip)
    .limit(limit)
    .toArray();

  const mapped = items.map((item) => {
    const { missing, hasMissing } = computeContentMissing(item);
    return {
      ...hydrateDocument('products', item),
      _missing: missing,
      _hasMissing: hasMissing,
    };
  });

  const filtered = onlyMissing ? mapped.filter((item) => item._hasMissing) : mapped;

  res.json({
    success: true,
    data: filtered,
    pagination: { page, limit, total: filtered.length },
  });
}));

router.put('/products/json', requireAdminToken, asyncHandler(async (req, res) => {
  const db = getDb();
  const payload = normalizeBsonLike(req.body || {});
  const requestId = Math.random().toString(36).substr(2, 9);

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

  const updates = { ...payload };
  delete updates._id;

  const now = new Date();
  updates.updatedAt = now;
  if (typeof updates.audit === 'undefined') {
    updates['audit.updatedAt'] = now;
  }

  try {
    const existing = await db.collection('products').findOne(query);
    if (!existing) {
      updates.createdAt = now;
      if (typeof updates.audit === 'undefined') {
        updates['audit.createdAt'] = now;
      }
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

    const updates = { ...payload };
    delete updates._id;
    updates.updatedAt = now;
    if (typeof updates.audit === 'undefined') {
      updates['audit.updatedAt'] = now;
    }

    const existing = await db.collection('products').findOne(query);
    if (!existing) {
      updates.createdAt = now;
      if (typeof updates.audit === 'undefined') {
        updates['audit.createdAt'] = now;
      }
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

  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.nameAr !== undefined) updates.nameAr = payload.nameAr;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.descriptionEn !== undefined) updates.description = payload.descriptionEn;
  if (payload.descriptionAr !== undefined) updates.descriptionAr = payload.descriptionAr;
  if (payload.image !== undefined) updates.image = payload.image;
  if (payload.images !== undefined) updates.images = payload.images;
  if (payload.category !== undefined) updates.category = payload.category;
  if (payload.categoryAr !== undefined) updates.categoryAr = payload.categoryAr;
  if (payload.cat_code !== undefined) updates.cat_code = payload.cat_code;
  if (payload.brand !== undefined) updates.brand = payload.brand;
  if (payload.brand_code !== undefined) updates.brand_code = payload.brand_code;
  if (payload.inTheBox !== undefined) updates.inTheBox = payload.inTheBox;
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
    const merged = existingVariants.map((variant) => {
      const match = payload.colorVariants.find((c) => {
        const variantStkCode = String(variant?.stk_code || variant?.stkCode || '').trim();
        const colorStkCode = String(c?.stk_code || c?.stkCode || '').trim();
        if (variantStkCode && colorStkCode) {
          return variantStkCode === colorStkCode;
        }
        if (variantStkCode || colorStkCode) {
          return false;
        }
        const name = String(c?.name || c?.color_name || '').trim().toLowerCase();
        const nameAr = String(c?.nameAr || c?.color_name_ar || '').trim().toLowerCase();
        const variantName = String(variant?.color_name || variant?.name || '').trim().toLowerCase();
        const variantNameAr = String(variant?.color_name_ar || variant?.nameAr || '').trim().toLowerCase();
        return Boolean(
          (name && variantName && variantName === name) ||
          (nameAr && variantNameAr && variantNameAr === nameAr)
        );
      });
      if (!match) return variant;
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
      };
    });
    updates.colorVariants = merged;
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
    actionType: 'product_content_update',
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
