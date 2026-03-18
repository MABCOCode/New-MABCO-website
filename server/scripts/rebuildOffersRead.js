const { connectMongo, closeMongo, getDb } = require('../src/config/db');
const { rebuildOffersRead } = require('../src/services/offersRead.service');

async function rebuild() {
  const start = Date.now();
  await connectMongo();
  const db = getDb();
  await rebuildOffersRead(db, { logger: console });
  await closeMongo();
  console.log('[rebuildOffersRead] total time ms:', Date.now() - start);
}

rebuild()
  .then(() => {
    console.log('[rebuildOffersRead] done');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[rebuildOffersRead] failed', err);
    process.exit(1);
  });
