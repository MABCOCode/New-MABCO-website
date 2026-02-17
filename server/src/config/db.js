const { MongoClient, ServerApiVersion } = require('mongodb');
const { mongoUri, mongoDbName } = require('./env');

let client;
let db;

async function connectMongo() {
  if (db) return db;

  client = new MongoClient(mongoUri, {
    serverApi: ServerApiVersion.v1,
  });

  await client.connect();
  db = client.db(mongoDbName);
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
