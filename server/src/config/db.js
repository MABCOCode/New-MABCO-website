const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoUri, mongoDbName } = require('./env');

let client;
let db;

async function ensureUserIndexes(database) {
  const users = database.collection('users');
  const indexes = await users.indexes();
  const emailIndex = indexes.find((index) => index.name === 'email_1');

  if (emailIndex?.unique) {
    await users.dropIndex('email_1');
  }

  await users.createIndex(
    { email: 1 },
    {
      name: 'email_1',
      background: true,
    },
  );
}

function getProductValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['stk_code'],
      properties: {
        stk_code: { bsonType: 'string' },
        id: { bsonType: ['int', 'long', 'string'] },
        slug: { bsonType: 'string' },
        name: { bsonType: ['string', 'object'] },
        nameAr: { bsonType: 'string' },
        price: { bsonType: ['string', 'number', 'int', 'long'] },
        image: { bsonType: 'string' },
        images: { bsonType: 'array', items: { bsonType: ['string', 'object'] } },
        category: { bsonType: 'string' },
        categoryAr: { bsonType: 'string' },
        cat_code: { bsonType: 'string' },
        cat_codes: { bsonType: 'array', items: { bsonType: 'string' } },
        brand: { bsonType: 'string' },
        brandAr: { bsonType: 'string' },
        brand_code: { bsonType: 'string' },
        brand_codes: { bsonType: 'array', items: { bsonType: 'string' } },
        rating: { bsonType: ['number', 'int', 'long'] },
        reviews: { bsonType: ['number', 'int', 'long'] },
        badge: { bsonType: 'string' },
        isMostSold: { bsonType: 'bool' },
        isNew: { bsonType: 'bool' },
        isHot: { bsonType: 'bool' },
        description: { bsonType: ['string', 'object'] },
        descriptionAr: { bsonType: 'string' },
        availability: {
          bsonType: 'object',
          properties: {
            isAvailable: { bsonType: 'bool' },
            hiddenReason: { bsonType: 'string' },
            lastSyncedAt: { bsonType: 'date' },
          },
        },
        colorVariants: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['stk_code', 'price'],
            properties: {
              stk_code: { bsonType: 'string' },
              price: { bsonType: ['number', 'int', 'long'] },
              color_name: { bsonType: 'string' },
              color_name_ar: { bsonType: 'string' },
              color_hex: { bsonType: 'string' },
              in_stock: { bsonType: 'bool' },
              active: { bsonType: 'bool' },
              images: { bsonType: 'array', items: { bsonType: 'string' } },
            },
          },
        },
        chargeOptions: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['stk_code', 'price'],
            properties: {
              stk_code: { bsonType: 'string' },
              price: { bsonType: ['number', 'int', 'long'] },
              name: { bsonType: 'string' },
              name_ar: { bsonType: 'string' },
              in_stock: { bsonType: 'bool' },
              active: { bsonType: 'bool' },
            },
          },
        },
        specs: { bsonType: 'array' },
        inTheBox: { bsonType: 'array' },
        offers: { bsonType: 'array' },
        variants: { bsonType: 'array' },
        status: {
          bsonType: 'object',
          required: ['isActive', 'isHidden'],
          properties: {
            isActive: { bsonType: 'bool' },
            isHidden: { bsonType: 'bool' },
          },
        },
        audit: {
          bsonType: 'object',
          required: ['createdAt', 'updatedAt'],
          properties: {
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
      },
    },
  };
}

async function ensureProductValidator(database) {
  const collections = await database
    .listCollections({ name: 'products' }, { nameOnly: false })
    .toArray();

  if (collections.length === 0) {
    await database.createCollection('products', {
      validator: getProductValidator(),
    });
    return;
  }

  await database.command({
    collMod: 'products',
    validator: getProductValidator(),
    validationLevel: 'moderate',
  });
}

async function ensureSavedSpecTitleIndexes(database) {
  const savedSpecTitles = database.collection('saved_spec_titles');
  const indexes = await savedSpecTitles.indexes();
  const nameIndex = indexes.find((index) => index.name === 'nameEnNormalized_1');
  const iconImageIndex = indexes.find((index) => index.name === 'iconImageHash_1');

  if (
    nameIndex &&
    (nameIndex.unique || nameIndex.sparse || JSON.stringify(nameIndex.key || {}) !== JSON.stringify({ nameEnNormalized: 1 }))
  ) {
    await savedSpecTitles.dropIndex('nameEnNormalized_1');
  }

  if (
    iconImageIndex &&
    (iconImageIndex.unique || JSON.stringify(iconImageIndex.key || {}) !== JSON.stringify({ iconImageHash: 1 }))
  ) {
    await savedSpecTitles.dropIndex('iconImageHash_1');
  }

  await savedSpecTitles.createIndex(
    { nameEnNormalized: 1 },
    {
      name: 'nameEnNormalized_1',
      background: true,
    },
  );

  await savedSpecTitles.createIndex(
    { iconImageHash: 1 },
    {
      name: 'iconImageHash_1',
      background: true,
      sparse: true,
    },
  );

  await savedSpecTitles.createIndex(
    { usageCount: -1, 'audit.updatedAt': -1 },
    {
      name: 'usageCount_-1_audit.updatedAt_-1',
      background: true,
    },
  );
}

function getSavedSpecTitlesValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'icon', 'usageCount', 'status', 'audit'],
      properties: {
        name: {
          bsonType: 'object',
          required: ['en', 'ar'],
          properties: {
            en: { bsonType: 'string' },
            ar: { bsonType: 'string' },
          },
        },
        nameEn: { bsonType: 'string' },
        nameAr: { bsonType: 'string' },
        icon: { bsonType: 'string' },
        iconImage: { bsonType: 'string' },
        iconImageHash: { bsonType: 'string' },
        usageCount: { bsonType: ['int', 'long'], minimum: 0 },
        category: { bsonType: 'string' },
        nameEnNormalized: { bsonType: 'string' },
        status: {
          bsonType: 'object',
          required: ['isActive'],
          properties: {
            isActive: { bsonType: 'bool' },
          },
        },
        audit: {
          bsonType: 'object',
          required: ['createdAt', 'updatedAt'],
          properties: {
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    },
  };
}

async function ensureProductIndexes(database) {
  const products = database.collection('products');
  
  // Drop existing indexes if they exist with different names
  try {
    await products.dropIndex({ brand_code: 1, cat_code: 1, 'status.isHidden': 1, 'availability.isAvailable': 1, updatedAt: -1 });
  } catch (error) {
    // Index doesn't exist, continue
  }
  await products.createIndex(
    { brand_code: 1, cat_code: 1, 'status.isHidden': 1, 'availability.isAvailable': 1, updatedAt: -1 },
    { name: 'brand_cat_visibility_updatedAt', background: true },
  );
  
  try {
    await products.dropIndex({ brand_code: 1, updatedAt: -1 });
  } catch (error) {
    // Index doesn't exist, continue
  }
  await products.createIndex(
    { brand_code: 1, updatedAt: -1 },
    { name: 'brand_updatedAt', background: true },
  );
  
  try {
    await products.dropIndex({ cat_code: 1, updatedAt: -1 });
  } catch (error) {
    // Index doesn't exist, continue
  }
  await products.createIndex(
    { cat_code: 1, updatedAt: -1 },
    { name: 'cat_updatedAt', background: true },
  );
  
  try {
    await products.dropIndex({ brand_code: 1, price: 1 });
  } catch (error) {
    // Index doesn't exist, continue
  }
  await products.createIndex(
    { brand_code: 1, price: 1 },
    { name: 'brand_price', background: true },
  );
}

function getFaqsValidator() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        cat_code: { bsonType: 'string' },
        brand: { bsonType: 'string' },
        questions: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['question', 'answer'],
            properties: {
              question: {
                bsonType: 'object',
                required: ['en', 'ar'],
                properties: {
                  en: { bsonType: 'string' },
                  ar: { bsonType: 'string' },
                },
              },
              answer: {
                bsonType: 'object',
                required: ['en', 'ar'],
                properties: {
                  en: { bsonType: 'string' },
                  ar: { bsonType: 'string' },
                },
              },
            },
          },
        },
        audit: {
          bsonType: 'object',
          properties: {
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    },
  };
}

async function ensureFaqsValidator(database) {
  const collections = await database
    .listCollections({ name: 'faqs' }, { nameOnly: false })
    .toArray();

  if (collections.length === 0) {
    await database.createCollection('faqs', {
      validator: getFaqsValidator(),
    });
    return;
  }

  await database.command({
    collMod: 'faqs',
    validator: getFaqsValidator(),
    validationLevel: 'moderate',
  });
}

async function ensureSavedSpecTitleValidator(database) {
  const collections = await database
    .listCollections({ name: 'saved_spec_titles' }, { nameOnly: false })
    .toArray();

  if (collections.length === 0) {
    await database.createCollection('saved_spec_titles', {
      validator: getSavedSpecTitlesValidator(),
    });
    return;
  }

  await database.command({
    collMod: 'saved_spec_titles',
    validator: getSavedSpecTitlesValidator(),
    validationLevel: 'strict',
  });
}

async function connectMongo() {
  if (db) return db;

  client = new MongoClient(mongoUri, {
    serverApi: ServerApiVersion.v1,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  });

  await client.connect();
  db = client.db(mongoDbName);
  await ensureProductValidator(db);
  await ensureProductIndexes(db);
  await ensureUserIndexes(db);
  await ensureSavedSpecTitleValidator(db);
  await ensureSavedSpecTitleIndexes(db);
  await ensureFaqsValidator(db);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('MongoDB is not connected. Call connectMongo() first.');
  }
  return db;
}

async function closeMongo() {
  if (client) {
    await client.close();
  }
  client = null;
  db = null;
}

module.exports = {
  connectMongo,
  getDb,
  closeMongo,
};
