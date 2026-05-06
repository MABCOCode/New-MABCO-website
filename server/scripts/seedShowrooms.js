const fs = require('fs');
const path = require('path');

async function seedShowrooms() {
  const { MongoClient } = require('mongodb');
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || 'mabco';

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const jsonPath = path.join(__dirname, '..', '..', 'client', 'public', 'static', 'showrooms.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(rawData);

    const arList = Array.isArray(parsed) && parsed[0]?.ar ? parsed[0].ar : [];
    const enList = Array.isArray(parsed) && parsed[1]?.en ? parsed[1].en : [];

    const enMap = new Map();
    enList.forEach((item) => {
      if (item.Loc_code) enMap.set(String(item.Loc_code), item);
    });

    const toDoc = (ar, en) => {
      const lng = parseFloat(String(ar.Longitude || '')) || 0;
      const lat = parseFloat(String(ar.Latitude || '')) || 0;
      return {
        code: String(ar.Loc_code || ''),
        name: {
          en: String(en?.Loc_name || ar.Loc_name || ''),
          ar: String(ar.Loc_name || ''),
        },
        city: {
          en: String(en?.City_name || ar.City_name || ''),
          ar: String(ar.City_name || ''),
        },
        address: {
          en: String(en?.Address || ar.Address || ''),
          ar: String(ar.Address || ''),
        },
        phone: String(ar.Phone || ''),
        warranty_type: String(ar.warranty_type || ''),
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        hours: {
          from: {
            en: String(en?.Winter_from_date || ar.Winter_from_date || ''),
            ar: String(ar.Winter_from_date || ''),
          },
          to: {
            en: String(en?.Winter_to_date || ar.Winter_to_date || ''),
            ar: String(ar.Winter_to_date || ''),
          },
        },
        week_end: {
          en: String(en?.week_end || ar.week_end || ''),
          ar: String(ar.week_end || ''),
        },
        image_link: String(ar.Image_Link || ''),
        isActive: true,
      };
    };

    const docs = arList
      .map((ar) => {
        const en = enMap.get(String(ar.Loc_code));
        return toDoc(ar, en);
      })
      .filter((d) => d.code);

    const existingCount = await db.collection('showrooms').countDocuments();
    if (existingCount > 0) {
      console.log(`Showrooms collection already has ${existingCount} documents. Clearing...`);
      await db.collection('showrooms').deleteMany({});
    }

    if (docs.length === 0) {
      console.log('No showroom documents to insert.');
      return;
    }

    const result = await db.collection('showrooms').insertMany(docs);
    console.log(`Inserted ${result.insertedCount} showrooms into MongoDB.`);
  } catch (err) {
    console.error('Failed to seed showrooms:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedShowrooms();
