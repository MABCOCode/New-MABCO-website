const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'mabco_website';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

async function createCollections(db) {
  const collections = [
    { name: 'products', validator: getProductValidator(), indexes: getProductIndexes() },
    { name: 'categories', validator: getCategoryValidator(), indexes: getCategoryIndexes() },
    { name: 'brands', validator: getBrandValidator(), indexes: getBrandIndexes() },
    { name: 'offers', validator: getOfferValidator(), indexes: getOfferIndexes() },
    { name: 'users', validator: getUserValidator(), indexes: getUserIndexes() },
    { name: 'orders', validator: getOrderValidator(), indexes: getOrderIndexes() },
    { name: 'carts', validator: getCartValidator(), indexes: getCartIndexes() },
    { name: 'showrooms', validator: getShowroomValidator(), indexes: getShowroomIndexes() },
    { name: 'notifications', validator: getNotificationValidator(), indexes: getNotificationIndexes() },
    { name: 'assets', validator: getAssetValidator(), indexes: getAssetIndexes() },
    { name: 'warranties', validator: getWarrantyValidator(), indexes: getWarrantyIndexes() },
    { name: 'maintenance_tickets', validator: getMaintenanceTicketValidator(), indexes: getMaintenanceTicketIndexes() },
    { name: 'payment_transactions', validator: getPaymentTransactionValidator(), indexes: getPaymentTransactionIndexes() },
    { name: 'service_requests', validator: getServiceRequestValidator(), indexes: getServiceRequestIndexes() },
    { name: 'admin_actions', validator: getAdminActionValidator(), indexes: getAdminActionIndexes() },
    { name: 'product_revisions', validator: getProductRevisionValidator(), indexes: getProductRevisionIndexes() },
    { name: 'report_daily_kpis', validator: getReportDailyKPIValidator(), indexes: getReportDailyKPIIndexes() },
    {
      name: 'web_events',
      isTimeSeries: true,
      timeSeriesConfig: { timeField: 'eventAt', metaField: 'meta', granularity: 'minutes' },
      indexes: getWebEventIndexes()
    },
    {
      name: 'cart_events',
      isTimeSeries: true,
      timeSeriesConfig: { timeField: 'eventAt', metaField: 'meta', granularity: 'minutes' },
      indexes: getCartEventIndexes()
    },
    {
      name: 'notification_events',
      isTimeSeries: true,
      timeSeriesConfig: { timeField: 'eventAt', metaField: 'meta', granularity: 'minutes' },
      indexes: getNotificationEventIndexes()
    },
    { name: 'home_read', validator: getHomeReadValidator(), indexes: getHomeReadIndexes() },
    { name: 'product_detail_read', validator: getProductDetailReadValidator(), indexes: getProductDetailReadIndexes() },
    { name: 'products_read', validator: getProductsReadValidator(), indexes: getProductsReadIndexes() },
    { name: 'category_brand_read', validator: getCategoryBrandReadValidator(), indexes: getCategoryBrandReadIndexes() },
    { name: 'offers_read', validator: getOffersReadValidator(), indexes: getOffersReadIndexes() },
    { name: 'showrooms_read', validator: getShowroomsReadValidator(), indexes: getShowroomsReadIndexes() },
    { name: 'footer_read', validator: getFooterReadValidator(), indexes: getFooterReadIndexes() },
    { name: 'site_content', validator: getSiteContentValidator(), indexes: getSiteContentIndexes() }
  ];

  console.log(`${colors.cyan}Starting collection creation...${colors.reset}\n`);

  for (const collection of collections) {
    try {
      const collectionsList = await db.listCollections({ name: collection.name }).toArray();

      if (collectionsList.length > 0) {
        console.log(`${colors.yellow}Collection "${collection.name}" already exists, dropping...${colors.reset}`);
        await db.collection(collection.name).drop();
      }

      if (collection.isTimeSeries) {
        await db.createCollection(collection.name, { timeseries: collection.timeSeriesConfig });
        console.log(`${colors.green}Created time-series collection: ${collection.name}${colors.reset}`);
      } else {
        await db.createCollection(collection.name, { validator: collection.validator });
        console.log(`${colors.green}Created collection: ${collection.name}${colors.reset}`);
      }

      if (collection.indexes?.length) {
        const col = db.collection(collection.name);
        for (const index of collection.indexes) {
          try {
            await col.createIndex(index.spec, index.options || {});
            console.log(`${colors.blue}  - Created index: ${JSON.stringify(index.spec)}${colors.reset}`);
          } catch (indexError) {
            console.error(`${colors.red}  - Error creating index: ${indexError.message}${colors.reset}`);
          }
        }
      }
    } catch (error) {
      console.error(`${colors.red}Error creating collection "${collection.name}": ${error.message}${colors.reset}`);
    }
  }
}

// Validators
function getProductValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['sku', 'slug', 'name', 'status', 'audit'],
      properties: {
        sku: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        name: {
          bsonType: 'object',
          required: ['en', 'ar'],
          properties: { en: { bsonType: 'string' }, ar: { bsonType: 'string' } }
        },
        status: {
          bsonType: 'object',
          required: ['isActive', 'isHidden'],
          properties: { isActive: { bsonType: 'bool' }, isHidden: { bsonType: 'bool' } }
        },
        audit: {
          bsonType: 'object',
          required: ['createdAt', 'updatedAt'],
          properties: { createdAt: { bsonType: 'date' }, updatedAt: { bsonType: 'date' } }
        }
      }
    }
  };
}

function getCategoryValidator() { return localizedActiveValidator(['slug']); }
function getBrandValidator() { return localizedActiveValidator(['slug']); }

function localizedActiveValidator(required = []) {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: [...required, 'name', 'isActive'],
      properties: {
        name: {
          bsonType: 'object',
          required: ['en', 'ar'],
          properties: { en: { bsonType: 'string' }, ar: { bsonType: 'string' } }
        },
        isActive: { bsonType: 'bool' }
      }
    }
  };
}

function getOfferValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['code', 'type', 'title', 'isActive'],
      properties: {
        code: { bsonType: 'string' },
        type: { bsonType: 'string', enum: ['direct_discount', 'coupon', 'free_product', 'bundle_discount'] },
        title: {
          bsonType: 'object',
          required: ['en', 'ar'],
          properties: { en: { bsonType: 'string' }, ar: { bsonType: 'string' } }
        },
        isActive: { bsonType: 'bool' }
      }
    }
  };
}

function getUserValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'role'],
      properties: {
        email: { bsonType: 'string' },
        role: { bsonType: 'string', enum: ['customer', 'admin', 'super_admin'] }
      }
    }
  };
}

function getOrderValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['orderNumber', 'items', 'status', 'createdAt'],
      properties: {
        orderNumber: { bsonType: 'string' },
        items: { bsonType: 'array' },
        status: { bsonType: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'] },
        createdAt: { bsonType: 'date' }
      }
    }
  };
}

function getCartValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['items', 'updatedAt'], properties: { items: { bsonType: 'array' }, updatedAt: { bsonType: 'date' } } } };
}

function getShowroomValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['code', 'name', 'location', 'isActive'],
      properties: {
        code: { bsonType: 'string' },
        name: {
          bsonType: 'object',
          required: ['en', 'ar'],
          properties: { en: { bsonType: 'string' }, ar: { bsonType: 'string' } }
        },
        location: {
          bsonType: 'object',
          required: ['type', 'coordinates'],
          properties: {
            type: { bsonType: 'string', enum: ['Point'] },
            coordinates: { bsonType: 'array', items: { bsonType: 'double' } }
          }
        },
        isActive: { bsonType: 'bool' }
      }
    }
  };
}

function getNotificationValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['type', 'status'],
      properties: {
        type: { bsonType: 'string' },
        status: { bsonType: 'string', enum: ['draft', 'scheduled', 'sent', 'failed'] }
      }
    }
  };
}

function getAssetValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['storageKey', 'cdnUrl'], properties: { storageKey: { bsonType: 'string' }, cdnUrl: { bsonType: 'string' } } } };
}

function getWarrantyValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['serialNumber', 'userId', 'productId', 'startsAt', 'endsAt'], properties: { serialNumber: { bsonType: 'string' }, userId: { bsonType: 'objectId' }, productId: { bsonType: 'objectId' }, startsAt: { bsonType: 'date' }, endsAt: { bsonType: 'date' } } } };
}

function getMaintenanceTicketValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['ticketNumber', 'userId', 'statusCode'], properties: { ticketNumber: { bsonType: 'string' }, userId: { bsonType: 'objectId' }, statusCode: { bsonType: 'int' } } } };
}

function getPaymentTransactionValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['transactionId', 'provider', 'amount', 'status'], properties: { transactionId: { bsonType: 'string' }, provider: { bsonType: 'string' }, amount: { bsonType: 'number' }, status: { bsonType: 'string' } } } };
}

function getServiceRequestValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['type', 'userId', 'status'], properties: { type: { bsonType: 'string', enum: ['printing', 'gaming', 'repair', 'other'] }, userId: { bsonType: 'objectId' }, status: { bsonType: 'string' } } } };
}

function getAdminActionValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['actorUserId', 'actorRole', 'actionType', 'targetType', 'targetId', 'createdAt'], properties: { actorUserId: { bsonType: 'objectId' }, actorRole: { bsonType: 'string' }, actionType: { bsonType: 'string' }, targetType: { bsonType: 'string' }, targetId: {}, createdAt: { bsonType: 'date' } } } };
}

function getProductRevisionValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['productId', 'version', 'snapshot', 'editedBy', 'editedAt'], properties: { productId: { bsonType: 'objectId' }, version: { bsonType: 'int' }, snapshot: { bsonType: 'object' }, editedBy: { bsonType: 'objectId' }, editedAt: { bsonType: 'date' } } } };
}

function getReportDailyKPIValidator() { return { $jsonSchema: { bsonType: 'object', required: ['date'], properties: { date: { bsonType: 'date' } } } }; }
function getHomeReadValidator() { return localeReadValidator(['_id']); }
function getProductDetailReadValidator() { return localeReadValidator(['_id', 'productId']); }
function getProductsReadValidator() { return localeReadValidator(['_id', 'productId']); }
function getCategoryBrandReadValidator() { return localeReadValidator(['_id', 'categoryId']); }
function getOffersReadValidator() { return localeReadValidator(['_id', 'offerType']); }
function getShowroomsReadValidator() { return localeReadValidator(['_id']); }
function getFooterReadValidator() { return localeReadValidator(['_id']); }

function localeReadValidator(extraRequired = []) {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: [...extraRequired, 'locale'],
      properties: { _id: {}, locale: { bsonType: 'string', enum: ['en', 'ar'] } }
    }
  };
}

function getSiteContentValidator() {
  return { $jsonSchema: { bsonType: 'object', required: ['key', 'locale'], properties: { key: { bsonType: 'string' }, locale: { bsonType: 'string', enum: ['en', 'ar'] }, content: { bsonType: 'object' } } } };
}

// Index functions
function getProductIndexes() { return [ { spec: { sku: 1 }, options: { unique: true } }, { spec: { slug: 1 }, options: { unique: true } }, { spec: { brandId: 1, categoryIds: 1, 'status.isActive': 1, 'status.isHidden': 1 } }, { spec: { updatedAt: -1 } } ]; }
function getCategoryIndexes() { return [ { spec: { slug: 1 }, options: { unique: true } }, { spec: { isActive: 1, sortOrder: 1 } } ]; }
function getBrandIndexes() { return [ { spec: { slug: 1 }, options: { unique: true } }, { spec: { categoryIds: 1, isActive: 1 } } ]; }
function getOfferIndexes() { return [ { spec: { code: 1 }, options: { unique: true } }, { spec: { isActive: 1, 'window.startsAt': 1, 'window.endsAt': 1 } }, { spec: { 'scope.categoryIds': 1, 'scope.brandIds': 1 } } ]; }
function getUserIndexes() { return [ { spec: { email: 1 }, options: { unique: true } }, { spec: { role: 1, 'adminMeta.isSuspended': 1 } } ]; }
function getOrderIndexes() { return [ { spec: { orderNumber: 1 }, options: { unique: true } }, { spec: { userId: 1, createdAt: -1 } }, { spec: { status: 1, createdAt: -1 } } ]; }
function getCartIndexes() { return [ { spec: { userId: 1 } }, { spec: { sessionId: 1 } }, { spec: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } } ]; }
function getShowroomIndexes() { return [ { spec: { code: 1 }, options: { unique: true } }, { spec: { location: '2dsphere' } }, { spec: { isActive: 1, 'city.en': 1 } } ]; }
function getNotificationIndexes() { return [ { spec: { status: 1, scheduleAt: 1 } }, { spec: { createdBy: 1, createdAt: -1 } } ]; }
function getAssetIndexes() { return [ { spec: { storageKey: 1 }, options: { unique: true } } ]; }
function getWarrantyIndexes() { return [ { spec: { serialNumber: 1 }, options: { unique: true } }, { spec: { userId: 1, endsAt: 1 } } ]; }
function getMaintenanceTicketIndexes() { return [ { spec: { ticketNumber: 1 }, options: { unique: true } }, { spec: { userId: 1, statusCode: 1, updatedAt: -1 } } ]; }
function getPaymentTransactionIndexes() { return [ { spec: { transactionId: 1 }, options: { unique: true } }, { spec: { status: 1, createdAt: -1 } } ]; }
function getServiceRequestIndexes() { return [ { spec: { type: 1, status: 1, createdAt: -1 } } ]; }
function getAdminActionIndexes() { return [ { spec: { actorUserId: 1, createdAt: -1 } }, { spec: { targetType: 1, targetId: 1, createdAt: -1 } }, { spec: { actionType: 1, createdAt: -1 } } ]; }
function getProductRevisionIndexes() { return [ { spec: { productId: 1, version: -1 } }, { spec: { editedBy: 1, editedAt: -1 } } ]; }
function getReportDailyKPIIndexes() { return [ { spec: { date: 1 }, options: { unique: true } } ]; }
function getWebEventIndexes() { return [ { spec: { eventAt: -1 } }, { spec: { 'meta.userId': 1, eventAt: -1 } } ]; }
function getCartEventIndexes() { return [ { spec: { eventAt: -1 } }, { spec: { 'meta.productId': 1, eventAt: -1 } }, { spec: { 'meta.userId': 1, eventAt: -1 } } ]; }
function getNotificationEventIndexes() { return [ { spec: { 'meta.notificationId': 1, eventAt: -1 } }, { spec: { 'meta.userId': 1, eventAt: -1 } } ]; }
function getHomeReadIndexes() { return [ { spec: { _id: 1 } } ]; }
function getProductDetailReadIndexes() { return [ { spec: { _id: 1 } }, { spec: { productId: 1, locale: 1 } } ]; }
function getProductsReadIndexes() { return [ { spec: { _id: 1 } }, { spec: { productId: 1, locale: 1 } } ]; }
function getCategoryBrandReadIndexes() { return [ { spec: { _id: 1 } } ]; }
function getOffersReadIndexes() { return [ { spec: { _id: 1 } } ]; }
function getShowroomsReadIndexes() { return [ { spec: { _id: 1 } } ]; }
function getFooterReadIndexes() { return [ { spec: { _id: 1 } } ]; }
function getSiteContentIndexes() { return [ { spec: { _id: 1 } } ]; }

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log(`${colors.cyan}Connecting to MongoDB at ${MONGODB_URI}...${colors.reset}`);
    await client.connect();
    console.log(`${colors.green}Connected to MongoDB${colors.reset}`);

    const db = client.db(MONGODB_DB_NAME);
    console.log(`${colors.cyan}Using database: ${MONGODB_DB_NAME}${colors.reset}\n`);

    await createCollections(db);

    console.log(`\n${colors.green}${colors.bright}All collections created successfully!${colors.reset}`);

    const collectionsList = await db.listCollections().toArray();
    console.log(`\n${colors.cyan}Collections in database:${colors.reset}`);
    collectionsList.forEach(col => console.log(`${colors.blue}  - ${col.name}${colors.reset}`));
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    await client.close();
    console.log(`${colors.cyan}Disconnected from MongoDB${colors.reset}`);
  }
}

main().catch(console.error);
