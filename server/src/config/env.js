const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  mongoDbName: process.env.MONGODB_DB_NAME || 'mabco_website',
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:5173').split(',').map((x) => x.trim()).filter(Boolean),
  adminApiKey: process.env.ADMIN_API_KEY || '',
  smsUser: process.env.SMS_USER || 'mab687',
  smsPass: process.env.SMS_PASS || 'ocbam4141',
  smsFrom: process.env.SMS_FROM || 'MABCO',
  smsLang: process.env.SMS_LANG || '0',
  otpSecret: process.env.OTP_SECRET || 'otp-secret',
  adminTokenSecret: process.env.ADMIN_TOKEN_SECRET || process.env.OTP_SECRET || 'admin-token-secret',
  posSyncToken: process.env.POS_SYNC_TOKEN || '',
  posSyncConnString: process.env.POS_SYNC_CONN_STRING || '',
  posSyncTimeoutMs: Math.max(Number(process.env.POS_SYNC_TIMEOUT_MS || 15 * 60 * 1000), 60 * 1000),
};
