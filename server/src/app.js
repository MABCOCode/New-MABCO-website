const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const requestIp = require('request-ip');
const Joi = require('joi');
const { clientOrigins, nodeEnv } = require('./config/env');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.disable("x-powered-by");

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (nodeEnv !== 'production') {
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch {
        // Ignore invalid origin and continue to reject below.
      }
    }

    if (clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
app.use(requestIp.mw());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const isAdminRequest = (req) => {
  const adminKey = req.headers['x-admin-key'];
  const adminToken = req.headers['x-admin-token'];
  const adminUserId = req.headers['x-admin-user-id'];
  const authHeader = req.headers.authorization || '';
  const hasBearer = authHeader.toLowerCase().startsWith('bearer ');
  const isAdmin = Boolean(adminKey || adminToken || hasBearer || adminUserId);
  
  if (isAdmin) {
    console.log(`[RATE-LIMIT] Admin request detected:`, {
      hasAdminKey: !!adminKey,
      hasAdminToken: !!adminToken,
      hasAdminUserId: !!adminUserId,
      hasBearerToken: hasBearer,
      path: req.originalUrl
    });
  }
  
  return isAdmin;
};

const isAuthRoute = (req) => {
  const path = String(req.originalUrl || req.url || '');
  return path.includes('/api/auth');
};

const isPublicRoute = (req) => {
  const path = String(req.originalUrl || req.url || '');
  // Routes that should have higher limits or be public
  const publicRoutes = [
    '/api/banner-slides',
    '/api/products',
    '/api/categories',
    '/api/brands',
    '/api/offers'
  ];
  return publicRoutes.some(route => path.startsWith(route)) && req.method === 'GET';
};

const generalLimiter = rateLimit({
  store: nodeEnv === 'production' ? new MongoStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    collectionName: 'rateLimits',
    expireTimeMs: 15 * 60 * 1000
  }) : undefined, // Use memory store in development
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const skipAdmin = isAdminRequest(req);
    const skipAuth = isAuthRoute(req);
    const skipPublic = isPublicRoute(req);
    
    // Always skip admins, auth routes, and public GET requests
    if (skipAdmin || skipAuth || skipPublic) {
      const reason = skipAdmin ? 'Admin' : skipAuth ? 'Auth' : 'Public Route';
      console.log(`[RATE-LIMIT] Skipping rate limit - Reason: ${reason}, Path: ${req.originalUrl}`);
      return true;
    }
    
    return false;
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For if available (for proxied requests)
    return req.headers['x-forwarded-for'] || req.clientIp || req.ip || 'unknown';
  }
});

const formLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many form submissions',
  skip: (req) => {
    const skipAdmin = isAdminRequest(req);
    const skipAuth = isAuthRoute(req);
    
    if (skipAdmin || skipAuth) {
      console.log(`[RATE-LIMIT-FORM] Skipping form limit - Admin: ${skipAdmin}, Auth: ${skipAuth}, Path: ${req.originalUrl}`);
      return true;
    }
    
    return false;
  },
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.clientIp || req.ip || 'unknown';
  }
});

const botPatterns = [
  /bot/i, /crawl/i, /spider/i, /scrape/i,
  /scanner/i, /wget/i, /curl/i, /python/i,
  /headless/i, /selenium/i
];
const detectBot = (req, res, next) => {
  if (isAdminRequest(req) || isAuthRoute(req) || isPublicRoute(req)) return next();
  const userAgent = req.headers['user-agent'] || '';
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  if (isBot) {
    console.log(`Bot detected: ${userAgent} from ${req.ip}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  return next();
};

app.use(detectBot);
app.use('/api/', generalLimiter);
app.use('/api/submit', formLimiter);

const submitSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().max(1000).required()
});
const validateInput = (req, res, next) => {
  const { error } = submitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details });
  }
  if (req.body.name) {
    req.body.name = req.body.name.replace(/[<>]/g, '');
  }
  return next();
};

app.get('/', (req, res) => {
  res.json({ success: true, message: 'MABCO Server API' });
});
app.post('/api/submit', validateInput, (req, res) => {
  res.json({ success: true });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
