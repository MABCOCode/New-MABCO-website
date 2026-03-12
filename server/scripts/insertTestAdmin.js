const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'mabco_website';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');
    const id = new ObjectId('507f1f77bcf86cd799439011');
    const existing = await users.findOne({_id: id});
    if (existing) {
      console.log('User already exists');
    } else {
      await users.insertOne({
        _id: id,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        adminMeta: { allowAllCategories: false, allowAllBrands: false, allowedCategoryIds: [], allowedBrandIds: [], isSuspended: false },
        createdAt: new Date(),
      });
      console.log('Inserted admin user');
    }
  } catch (e) {
    console.error('error', e);
  } finally {
    await client.close();
  }
})();