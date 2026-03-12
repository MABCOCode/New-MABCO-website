const express = require('express');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { hydrateCollection, hydrateDocument } = require('../models');

const router = express.Router();

function toObjectIdArray(values = []) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (ObjectId.isValid(String(value)) ? new ObjectId(String(value)) : null))
    .filter(Boolean);
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
    { _id: new ObjectId(id), role: { $in: ['admin', 'super_admin'] } },
    { projection: { email: 1, role: 1, adminMeta: 1 } },
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'Admin user not found' });
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

  const allowAllCategories = Boolean(req.body.allowAllCategories);
  const allowAllBrands = Boolean(req.body.allowAllBrands);
  // store the raw codes from the client instead of converting to ObjectId
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

  console.log('Updating admin permissions for user', id, 'payload', {
    allowAllCategories,
    allowAllBrands,
    allowedCategoryIds,
    allowedBrandIds,
    isSuspended,
    canManageOrders,
    canManageBanners,
  });

  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id), role: { $in: ['admin', 'super_admin'] } },
    { $set: setDoc },
    {
      returnDocument: 'after',
      projection: { email: 1, role: 1, adminMeta: 1 },
    },
  );
  if (!result) {
    console.warn('No matching admin user found for', id);
  } else {
    console.log('Update result', result);
  }
  if (!result || !result.value) {
    return res.status(404).json({ success: false, message: 'Admin user not found' });
  }
  return res.json({ success: true, data: result.value });
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
  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { role } },
    { returnDocument: 'after', projection: { email:1,role:1,adminMeta:1 } }
  );
  if (!result.value) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  console.log('Changed role for', id, 'to', role);
  res.json({ success: true, data: result.value });
}));

router.get('/orders', asyncHandler(async (req, res) => {
  const db = getDb();
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const items = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: hydrateCollection('orders', items) });
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
  if (payload.brand !== undefined) updates.brand = payload.brand;
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
        const name = c?.name || c?.color_name;
        const nameAr = c?.nameAr || c?.color_name_ar;
        return (
          (name && String(variant?.color_name || variant?.name || '').toLowerCase() === String(name).toLowerCase()) ||
          (nameAr && String(variant?.color_name_ar || variant?.nameAr || '').toLowerCase() === String(nameAr).toLowerCase())
        );
      });
      if (!match) return variant;
      const images = Array.isArray(match.images)
        ? match.images
        : match.image
        ? [match.image]
        : [];
      return {
        ...variant,
        color_name: match.color_name || match.name || variant.color_name,
        color_name_ar: match.color_name_ar || match.nameAr || variant.color_name_ar,
        color_hex: match.color_hex || match.hexCode || variant.color_hex,
        images: images.length > 0 ? images : variant.images,
        image: images.length > 0 ? images[0] : variant.image,
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
