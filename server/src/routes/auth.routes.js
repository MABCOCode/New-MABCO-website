const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { smsUser, smsPass, smsFrom, smsLang, otpSecret } = require('../config/env');

const router = express.Router();

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_PER_DAY = 5;

const PURPOSES = {
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
};

const normalizePhone = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) {
    return `963${digits.slice(1)}`;
  }
  if (digits.length === 9 && digits.startsWith('9')) {
    return `963${digits}`;
  }
  if (digits.startsWith('963') && digits.length >= 12) {
    return digits;
  }
  return null;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const hashOtp = (code, phone, purpose) =>
  crypto
    .createHash('sha256')
    .update(`${code}:${phone}:${purpose}:${otpSecret || 'otp-secret'}`)
    .digest('hex');

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString('hex');

const comparePassword = (password, salt, hash) =>
  hashPassword(password, salt) === hash;

const sendOtpSms = async ({ phone, code }) => {
  const msg = `Your verification code is ${code}`;
  const encodedMsg = encodeURIComponent(msg);
  const url = `https://services.mtnsyr.com:7443/General/MTNSERVICES/ConcatenatedSender.aspx?User=${encodeURIComponent(
    smsUser || 'mab687',
  )}&Pass=${encodeURIComponent(smsPass || 'ocbam4141')}&From=${encodeURIComponent(
    smsFrom || 'MABCO',
  )}&Lang=${encodeURIComponent(smsLang || '0')}&Msg=${encodedMsg}&Gsm=${phone}`;

  const res = await fetch(url, { method: 'GET' });
  const text = await res.text();
  return res.ok && String(text).includes(phone);
};

const loadOtpRecord = async (db, phone, purpose) => {
  return db.collection('otp_verifications').findOne({ phone, purpose });
};

const upsertOtpRecord = async (db, phone, purpose, updates) => {
  await db.collection('otp_verifications').updateOne(
    { phone, purpose },
    { $set: updates },
    { upsert: true },
  );
};

router.post('/signup/request-otp', asyncHandler(async (req, res) => {
  const db = getDb();
  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }

  const now = new Date();
  const dayKey = todayKey();
  const record = await loadOtpRecord(db, phone, PURPOSES.SIGNUP);

  const attemptsToday = record?.dayKey === dayKey ? Number(record.attemptsToday || 0) : 0;
  if (attemptsToday >= OTP_MAX_PER_DAY) {
    return res.status(429).json({ success: false, message: 'OTP limit reached for today' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashOtp(code, phone, PURPOSES.SIGNUP);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const sent = await sendOtpSms({ phone, code });
  if (!sent) {
    return res.status(502).json({ success: false, message: 'Failed to send OTP' });
  }

  await upsertOtpRecord(db, phone, PURPOSES.SIGNUP, {
    phone,
    purpose: PURPOSES.SIGNUP,
    codeHash,
    expiresAt,
    attemptsToday: attemptsToday + 1,
    dayKey,
    lastSentAt: now,
    verifyAttempts: 0,
  });

  res.json({ success: true, phone });
}));

router.post('/signup/verify-otp', asyncHandler(async (req, res) => {
  const db = getDb();
  const phone = normalizePhone(req.body?.phone);
  const code = String(req.body?.code || '').trim();
  const name = String(req.body?.name || '').trim();
  const email = req.body?.email ? String(req.body.email).trim() : '';
  const password = String(req.body?.password || '');

  if (!phone || code.length !== OTP_LENGTH || !name || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Invalid signup payload' });
  }

  const record = await loadOtpRecord(db, phone, PURPOSES.SIGNUP);
  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP not found' });
  }

  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  const expectedHash = hashOtp(code, phone, PURPOSES.SIGNUP);
  if (record.codeHash !== expectedHash) {
    const verifyAttempts = Number(record.verifyAttempts || 0) + 1;
    await upsertOtpRecord(db, phone, PURPOSES.SIGNUP, { verifyAttempts });
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  const existing = await db.collection('users').findOne({ phone });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Phone already registered' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user = {
    phone,
    email: email || undefined,
    name,
    nameAr: name,
    role: 'customer',
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('users').insertOne(user);
  await db.collection('otp_verifications').deleteOne({ phone, purpose: PURPOSES.SIGNUP });

  res.json({
    success: true,
    data: {
      id: result.insertedId,
      phone: user.phone,
      email: user.email || null,
      name: user.name,
      role: user.role,
    },
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const db = getDb();
  const identifier = String(req.body?.identifier || '').trim();
  const password = String(req.body?.password || '');
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Invalid login payload' });
  }

  const phone = normalizePhone(identifier);
  const query = phone ? { phone } : { email: identifier.toLowerCase() };
  const user = await db.collection('users').findOne(query);
  if (!user || !user.passwordHash || !user.passwordSalt) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!comparePassword(password, user.passwordSalt, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      phone: user.phone,
      email: user.email || null,
      name: user.name,
      role: user.role,
    },
  });
}));

router.post('/password/request-otp', asyncHandler(async (req, res) => {
  const db = getDb();
  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }

  const user = await db.collection('users').findOne({ phone });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const now = new Date();
  const dayKey = todayKey();
  const record = await loadOtpRecord(db, phone, PURPOSES.PASSWORD_RESET);
  const attemptsToday = record?.dayKey === dayKey ? Number(record.attemptsToday || 0) : 0;
  if (attemptsToday >= OTP_MAX_PER_DAY) {
    return res.status(429).json({ success: false, message: 'OTP limit reached for today' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashOtp(code, phone, PURPOSES.PASSWORD_RESET);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const sent = await sendOtpSms({ phone, code });
  if (!sent) {
    return res.status(502).json({ success: false, message: 'Failed to send OTP' });
  }

  await upsertOtpRecord(db, phone, PURPOSES.PASSWORD_RESET, {
    phone,
    purpose: PURPOSES.PASSWORD_RESET,
    codeHash,
    expiresAt,
    attemptsToday: attemptsToday + 1,
    dayKey,
    lastSentAt: now,
    verifyAttempts: 0,
  });

  res.json({ success: true, phone });
}));

router.post('/password/verify-otp', asyncHandler(async (req, res) => {
  const db = getDb();
  const phone = normalizePhone(req.body?.phone);
  const code = String(req.body?.code || '').trim();
  const newPassword = String(req.body?.newPassword || '');

  if (!phone || code.length !== OTP_LENGTH || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  const record = await loadOtpRecord(db, phone, PURPOSES.PASSWORD_RESET);
  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP not found' });
  }

  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  const expectedHash = hashOtp(code, phone, PURPOSES.PASSWORD_RESET);
  if (record.codeHash !== expectedHash) {
    const verifyAttempts = Number(record.verifyAttempts || 0) + 1;
    await upsertOtpRecord(db, phone, PURPOSES.PASSWORD_RESET, { verifyAttempts });
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);
  await db.collection('users').updateOne(
    { phone },
    { $set: { passwordHash, passwordSalt: salt, updatedAt: new Date() } },
  );

  await db.collection('otp_verifications').deleteOne({ phone, purpose: PURPOSES.PASSWORD_RESET });
  res.json({ success: true });
}));

module.exports = router;
