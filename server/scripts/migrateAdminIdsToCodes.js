const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// This script will convert any ObjectId values stored in adminMeta.allowedCategoryIds
// and adminMeta.allowedBrandIds into the corresponding cat_code/brand_code strings
// by looking up the category/brand documents.

(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'mabco_website';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const catDocs = await db.collection('categories').find({}).toArray();
    const brandDocs = await db.collection('brands').find({}).toArray();

    const catMap = new Map(catDocs.map((c) => [String(c._id), String(c.cat_code)]));
    const brandMap = new Map(brandDocs.map((b) => [String(b._id), String(b.brand_code)]));

    const cursor = db.collection('users').find({
      'adminMeta.allowedCategoryIds.0': { $exists: true },
    });

    let count = 0;
    while (await cursor.hasNext()) {
      const user = await cursor.next();
      const meta = user.adminMeta || {};
      const oldCats = Array.isArray(meta.allowedCategoryIds) ? meta.allowedCategoryIds : [];
      const oldBrands = Array.isArray(meta.allowedBrandIds) ? meta.allowedBrandIds : [];

      const newCats = oldCats.map((id) => catMap.get(String(id)) || String(id));
      const newBrands = oldBrands.map((id) => brandMap.get(String(id)) || String(id));

      // only update if any conversion happened
      const changed =
        newCats.some((v, i) => v !== String(oldCats[i])) ||
        newBrands.some((v, i) => v !== String(oldBrands[i]));

      if (changed) {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              'adminMeta.allowedCategoryIds': newCats,
              'adminMeta.allowedBrandIds': newBrands,
            },
          },
        );
        count += 1;
        console.log('Updated user', user._id.toString());
      }
    }

    console.log('Migration complete,', count, 'users modified.');
  } catch (err) {
    console.error('Migration error', err);
  } finally {
    await client.close();
  }
})();
