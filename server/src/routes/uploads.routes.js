const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { requireAdminKey } = require('../middleware/adminAuth');

const router = express.Router();

const uploadRoot = path.join(__dirname, '..', '..', 'images');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image uploads are allowed'));
  },
});

const dataUrlPattern = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;
const extByMime = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

router.post('/images', requireAdminKey, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  const host = `${req.protocol}://${req.get('host')}`;
  const url = `${host}/images/${encodeURIComponent(req.file.filename)}`;
  return res.json({ success: true, data: { url } });
});

router.post('/images-base64', requireAdminKey, express.json({ limit: '6mb' }), (req, res) => {
  const raw = String(req.body?.dataUrl || '').trim();
  const match = raw.match(dataUrlPattern);
  if (!match) {
    return res.status(400).json({ success: false, message: 'Invalid data URL' });
  }
  const mime = match[1];
  const base64 = match[2];
  const ext = extByMime[mime] || '';
  if (!ext) {
    return res.status(400).json({ success: false, message: 'Unsupported image type' });
  }
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) {
    return res.status(400).json({ success: false, message: 'Empty image data' });
  }
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const fullPath = path.join(uploadRoot, filename);
  fs.writeFileSync(fullPath, buffer);
  const host = `${req.protocol}://${req.get('host')}`;
  const url = `${host}/images/${encodeURIComponent(filename)}`;
  return res.json({ success: true, data: { url } });
});

module.exports = router;
