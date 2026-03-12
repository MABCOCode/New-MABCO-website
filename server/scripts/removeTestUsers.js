const { MongoClient } = require('mongodb');
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

    // remove users that look like dummy/test accounts
    // adjust filter as needed; current criteria:
    // - email ends with @example.com
    // - id equals some known test ObjectIds
    const criteria = {
      $or: [
        { email: /@example\.com$/ },
        { _id: { $in: [
          // legacy test ids
          new (require('mongodb').ObjectId)('507f1f77bcf86cd799439011'),
          new (require('mongodb').ObjectId)('507f1f77bcf86cd799439012'),
          new (require('mongodb').ObjectId)('507f1f77bcf86cd799439013'),
        ] } },
      ],
    };

    const result = await users.deleteMany(criteria);
    console.log('Deleted', result.deletedCount, 'test users');
  } catch (err) {
    console.error('error', err);
  } finally {
    await client.close();
  }
})();