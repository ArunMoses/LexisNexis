/* eslint-disable no-console */

const MongoClient = require("mongodb").MongoClient;


async function buildingRepository(mongoUrl) {
  const dbName = mongoUrl.split("/")[3];
  const mongoClient = new MongoClient(mongoUrl, {"useNewUrlParser": true, useUnifiedTopology: true });
  await mongoClient.connect();
  const db = mongoClient.db(dbName);

  async function save(docs) {
    for (const doc of docs) {
      await db.collection("buildings").updateOne(
        {"_id": doc._id},
        {"$set": doc},
        {"upsert": true}
      );
    }
  }

  async function close() {
    await mongoClient.close();
  }

  return {save, close};
}


module.exports = buildingRepository;
