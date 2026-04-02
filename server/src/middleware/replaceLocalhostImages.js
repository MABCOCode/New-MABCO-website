const OLD_BASES = [
  'http://localhost:5000',
  'https://localhost:5000',
  'http://127.0.0.1:5000',
  'https://127.0.0.1:5000',
];

const normalizeBase = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
};

const getPublicBaseUrl = (req) => {
  const explicit = process.env.SITE_URL;
  if (explicit && String(explicit).trim().length > 0) return String(explicit).trim();
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const proto = forwardedProto || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  if (host && String(host).trim().length > 0) {
    return `${proto}://${host}`;
  }
  return 'https://mabcoonline.com';
};

const isPlainObject = (value) => {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const replaceLocalhostImageUrls = (value, baseUrl) => {
  const siteUrl = normalizeBase(baseUrl || process.env.SITE_URL || 'https://mabcoonline.com');

  const replaceString = (input) => {
    if (typeof input !== 'string') return input;
    for (const base of OLD_BASES) {
      const normalized = normalizeBase(base);
      const prefix = `${normalized}/images/`;
      if (input.startsWith(prefix)) {
        return `${siteUrl}/images/${input.slice(prefix.length)}`;
      }
      const exact = `${normalized}/images`;
      if (input === exact) {
        return `${siteUrl}/images`;
      }
    }
    return input;
  };

  if (typeof value === 'string') return replaceString(value);
  if (Array.isArray(value)) {
    return value.map((item) => replaceLocalhostImageUrls(item, siteUrl));
  }
  if (isPlainObject(value)) {
    const output = {};
    for (const [key, item] of Object.entries(value)) {
      output[key] = replaceLocalhostImageUrls(item, siteUrl);
    }
    return output;
  }
  return value;
};

const replaceLocalhostImagesMiddleware = (req, res, next) => {
  const baseUrl = getPublicBaseUrl(req);
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(replaceLocalhostImageUrls(body, baseUrl));
  next();
};

module.exports = {
  replaceLocalhostImagesMiddleware,
  replaceLocalhostImageUrls,
  getPublicBaseUrl,
};
