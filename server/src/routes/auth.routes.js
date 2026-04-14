const express = require('express');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const asyncHandler = require('../utils/asyncHandler');
const { getDb } = require('../config/db');
const { smsUser, smsPass, smsFrom, smsLang, otpSecret, whatsappApiKey } = require('../config/env');
const { hashToken } = require('../middleware/adminTokenAuth');

const router = express.Router();

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_PER_DAY = 3;

const PURPOSES = {
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/;

const toPublicUser = (user) => ({
  id: user._id,
  phone: user.phone,
  email: user.email || null,
  name: user.name,
  nameAr: user.nameAr || user.name,
  username: user.username || null,
  role: user.role,
});

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

const buildValidationError = (message, fieldErrors) => ({
  success: false,
  message,
  fieldErrors,
});

const sendOtpSms = async ({ phone, code }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV MODE] OTP for ${phone}: ${code}`);
    return true;
  }

  const msg = `Your verification code is ${code}`;
  const encodedMsg = encodeURIComponent(msg);
  const url = `https://services.mtnsyr.com:7443/General/MTNSERVICES/ConcatenatedSender.aspx?User=${encodeURIComponent(
    smsUser || 'mab687',
  )}&Pass=${encodeURIComponent(smsPass || 'ocbam4141')}&From=${encodeURIComponent(
    smsFrom || 'MABCO',
  )}&Lang=${encodeURIComponent(smsLang || '0')}&Msg=${encodedMsg}&Gsm=${phone}`;

  const res = await fetch(url, { method: 'GET' });
  const text = String(await res.text()).trim();
  console.info(`[OTP] SMS API response for ${phone}:`, res.status, text);

  if (!res.ok) return false;
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes('error') || normalizedText.includes('failed')) {
    return false;
  }

  if (normalizedText.length === 0) {
    return false;
  }

  if (normalizedText.includes('ok') || normalizedText.includes('sent') || normalizedText.includes(phone)) {
    return true;
  }

  return true; // fallback: probably successful when status=200 but output format unknown
};

const sendOtpWhatsApp = async ({ phone, code }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV MODE] OTP (WhatsApp) for ${phone}: ${code}`);
    return true;
  }

  if (!whatsappApiKey) {
    console.warn('[OTP] WhatsApp API key is missing; skipping WhatsApp send.');
    return false;
  }

  const to = phone.startsWith('+') ? phone : `+${phone}`;
  const payload = {
    to,
    text: `Your verification code is ${code}`,
  };

  const res = await fetch('https://www.wasenderapi.com/api/send-message', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${whatsappApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseData;
  try {
    responseData = await res.json();
  } catch (error) {
    console.error(`[OTP] WhatsApp API response parsing failed for ${to}:`, res.status, error.message);
    return false;
  }

  // Log the result in npm server logs
  if (responseData.success) {
    console.log(`[OTP] WhatsApp API success for ${to}:`, responseData);
  } else {
    console.log(`[OTP] WhatsApp API failed for ${to}:`, responseData);
  }

  return responseData.success === true;
};

const sendOtpWithFallback = async ({ phone, code }) => {
  const whatsappSent = await sendOtpWhatsApp({ phone, code });
  if (whatsappSent) {
    return { sent: true, usedChannel: 'whatsapp', whatsappFailed: false };
  }

  const smsSent = await sendOtpSms({ phone, code });
  if (smsSent) {
    return { sent: true, usedChannel: 'sms', whatsappFailed: true };
  }

  return { sent: false, usedChannel: null, whatsappFailed: true };
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
  const username = String(req.body?.username || '').trim();
  const usernameLower = username.toLowerCase();
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }
  if (!username) {
    return res.status(400).json(buildValidationError('Invalid signup payload', {
      username: 'Username is required',
    }));
  }
  if (!USERNAME_REGEX.test(username)) {
    return res.status(400).json(buildValidationError('Invalid signup payload', {
      username: 'Username must be 3-30 characters and use only letters, numbers, dots, underscores, or hyphens',
    }));
  }

  const existingUser = await db.collection('users').findOne({ phone });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Phone number is already registered' });
  }

  const existingUsername = await db.collection('users').findOne({ usernameLower });
  if (existingUsername) {
    return res.status(409).json(buildValidationError('Username already registered', {
      username: 'Username is already registered',
    }));
  }

  const now = new Date();
  const dayKey = todayKey();
  const record = await loadOtpRecord(db, phone, PURPOSES.SIGNUP);

  const attemptsToday = record?.dayKey === dayKey ? Number(record.attemptsToday || 0) : 0;
  if (attemptsToday >= OTP_MAX_PER_DAY && process.env.NODE_ENV !== 'development') {
    return res.status(429).json({
      success: false,
      message: 'OTP limit reached for today',
      remainingAttempts: 0
    });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashOtp(code, phone, PURPOSES.SIGNUP);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const sendResult = await sendOtpWithFallback({ phone, code });
  if (!sendResult.sent) {
    return res.status(502).json({
      success: false,
      message: 'Failed to send OTP',
      remainingAttempts: Math.max(0, OTP_MAX_PER_DAY - attemptsToday)
    });
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

  res.json({
    success: true,
    phone,
    delivery: {
      primary: 'whatsapp',
      fallback: 'sms',
      notice: 'OTP will be sent to WhatsApp. If it fails, we will try SMS.',
      fallbackNotice: sendResult.whatsappFailed
        ? 'WhatsApp delivery failed. The website will try to send SMS.'
        : null,
      usedChannel: sendResult.usedChannel,
    },
    remainingAttempts: Math.max(0, OTP_MAX_PER_DAY - attemptsToday - 1)
  });
}));

router.post('/signup/verify-otp', asyncHandler(async (req, res) => {
  const db = getDb();
  const phone = normalizePhone(req.body?.phone);
  const code = String(req.body?.code || '').trim();
  const name = String(req.body?.name || '').trim();
  const username = String(req.body?.username || '').trim();
  const usernameLower = username.toLowerCase();
  const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : '';
  const password = String(req.body?.password || '');

  const fieldErrors = {};
  if (!name) fieldErrors.name = 'Full name is required';
  if (!username) fieldErrors.username = 'Username is required';
  else if (!USERNAME_REGEX.test(username)) fieldErrors.username = 'Username must be 3-30 characters and use only letters, numbers, dots, underscores, or hyphens';
  if (!phone) fieldErrors.phone = 'Invalid phone number';
  if (code.length !== OTP_LENGTH) fieldErrors.code = 'Verification code must be 6 digits';
  if (!password) fieldErrors.password = 'Password is required';
  else if (password.length < 6) fieldErrors.password = 'Password must be at least 6 characters';
  if (email && !EMAIL_REGEX.test(email)) fieldErrors.email = 'Invalid email address';

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json(buildValidationError('Invalid signup payload', fieldErrors));
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
    return res.status(409).json(buildValidationError('Phone already registered', {
      phone: 'Phone number is already registered',
    }));
  }

  const existingUsername = await db.collection('users').findOne({ usernameLower });
  if (existingUsername) {
    return res.status(409).json(buildValidationError('Username already registered', {
      username: 'Username is already registered',
    }));
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user = {
    phone,
    name,
    nameAr: name,
    username,
    usernameLower,
    role: 'customer',
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Only add email if it has a value (schema requires email to be string if present)
  if (email && email.trim()) {
    user.email = email.trim();
  }

  let result;
  try {
    result = await db.collection('users').insertOne(user);
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern || {})[0];
      if (duplicateKey === 'phone') {
        return res.status(409).json(buildValidationError('Phone already registered', {
          phone: 'Phone number is already registered',
        }));
      }
      if (duplicateKey === 'email') {
        return res.status(409).json(buildValidationError('Email already registered', {
          email: 'Email address is already registered',
        }));
      }
      if (duplicateKey === 'usernameLower') {
        return res.status(409).json(buildValidationError('Username already registered', {
          username: 'Username is already registered',
        }));
      }
    }
    throw error;
  }
  await db.collection('otp_verifications').deleteOne({ phone, purpose: PURPOSES.SIGNUP });

  res.json({
    success: true,
    data: toPublicUser({ ...user, _id: result.insertedId }),
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
  const query = phone
    ? { phone }
    : {
      $or: [
        { email: identifier.toLowerCase() },
        { usernameLower: identifier.toLowerCase() },
        { username: identifier },
        { name: identifier },
        { nameAr: identifier },
      ],
    };
  const user = await db.collection('users').findOne(query);
  if (!user || !user.passwordHash || !user.passwordSalt) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!comparePassword(password, user.passwordSalt, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    data: toPublicUser(user),
  });
}));

router.put('/profile', asyncHandler(async (req, res) => {
  const db = getDb();
  const userIdRaw = String(req.body?.userId || '').trim();
  const currentPhone = normalizePhone(req.body?.currentPhone || req.body?.phone);
  const nextPhone = normalizePhone(req.body?.phone);
  const name = String(req.body?.name || '').trim();
  const emailRaw = String(req.body?.email || '').trim().toLowerCase();

  const fieldErrors = {};
  if (!userIdRaw && !currentPhone) fieldErrors.userId = 'User id or phone is required';
  if (!name) fieldErrors.name = 'Full name is required';
  if (!nextPhone) fieldErrors.phone = 'Invalid phone number';
  if (emailRaw && !EMAIL_REGEX.test(emailRaw)) fieldErrors.email = 'Invalid email address';

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json(buildValidationError('Invalid profile payload', fieldErrors));
  }

  const query = {};
  if (userIdRaw) {
    if (!ObjectId.isValid(userIdRaw)) {
      return res.status(400).json(buildValidationError('Invalid profile payload', {
        userId: 'Invalid user id',
      }));
    }
    query._id = new ObjectId(userIdRaw);
  }
  if (currentPhone) {
    query.phone = currentPhone;
  }

  const existingUser = await db.collection('users').findOne(query);
  if (!existingUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (emailRaw) {
    const duplicateEmailUser = await db.collection('users').findOne({
      email: emailRaw,
      _id: { $ne: existingUser._id },
    });
    if (duplicateEmailUser) {
      return res.status(409).json(buildValidationError('Email already registered', {
        email: 'Email address is already registered',
      }));
    }
  }

  const duplicatePhoneUser = await db.collection('users').findOne({
    phone: nextPhone,
    _id: { $ne: existingUser._id },
  });
  if (duplicatePhoneUser) {
    return res.status(409).json(buildValidationError('Phone already registered', {
      phone: 'Phone number is already registered',
    }));
  }

  const updates = {
    phone: nextPhone,
    name,
    nameAr: name,
    updatedAt: new Date(),
    email: emailRaw || null,
  };

  let updatedUser;
  try {
    updatedUser = await db.collection('users').findOneAndUpdate(
      { _id: existingUser._id },
      { $set: updates },
      {
        returnDocument: 'after',
        projection: {
          phone: 1,
          email: 1,
          name: 1,
          nameAr: 1,
          username: 1,
          role: 1,
        },
      },
    );
  } catch (error) {
    if (error?.code === 11000 && Object.keys(error.keyPattern || {})[0] === 'email') {
      return res.status(409).json(buildValidationError('Email already registered', {
        email: 'Email address is already registered',
      }));
    }
    throw error;
  }

  res.json({
    success: true,
    data: toPublicUser({ ...(updatedUser?.value || updatedUser), _id: existingUser._id }),
  });
}));

router.post('/admin/token', asyncHandler(async (req, res) => {
  const db = getDb();
  const identifier = String(req.body?.identifier || req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Invalid login payload' });
  }

  const phone = normalizePhone(identifier);
  const query = phone
    ? { phone }
    : { $or: [{ email: identifier.toLowerCase() }, { name: identifier }, { nameAr: identifier }] };

  const user = await db.collection('users').findOne(query);
  if (!user || !user.passwordHash || !user.passwordSalt) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  if (!comparePassword(password, user.passwordSalt, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.collection('admin_tokens').insertOne({
    userId: user._id,
    tokenHash,
    createdAt: new Date(),
    expiresAt,
  });

  res.json({
    success: true,
    data: {
      token: rawToken,
      expiresAt,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email || null,
        name: user.name,
        role: user.role,
      },
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
    return res.status(429).json({
      success: false,
      message: 'OTP limit reached for today',
      remainingAttempts: 0
    });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashOtp(code, phone, PURPOSES.PASSWORD_RESET);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const sendResult = await sendOtpWithFallback({ phone, code });
  if (!sendResult.sent) {
    return res.status(502).json({
      success: false,
      message: 'Failed to send OTP',
      remainingAttempts: Math.max(0, OTP_MAX_PER_DAY - attemptsToday)
    });
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

  res.json({
    success: true,
    phone,
    delivery: {
      primary: 'whatsapp',
      fallback: 'sms',
      notice: 'OTP will be sent to WhatsApp. If it fails, we will try SMS.',
      fallbackNotice: sendResult.whatsappFailed
        ? 'WhatsApp delivery failed. The website will try to send SMS.'
        : null,
      usedChannel: sendResult.usedChannel,
    },
    remainingAttempts: Math.max(0, OTP_MAX_PER_DAY - attemptsToday - 1)
  });
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
