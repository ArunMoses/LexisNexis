/* eslint-disable no-process-env */

const chai = require("chai");
const jsonSchema = require('chai-json-schema-ajv')
chai.use(jsonSchema)
const { expect } = chai;
const execute = require("../src/execute");
const testData = require("./data/testData.json")
const fs = require("fs");

const MongoClient = require("mongodb").MongoClient;
const mongoUrl = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/buildingImporter";
const dbName = mongoUrl.split("/")[3];
const mongoClient = new MongoClient(mongoUrl, {"useNewUrlParser": true, useUnifiedTopology: true });

let dbConnection;
before(async () => {
  await mongoClient.connect();
  dbConnection = mongoClient.db(dbName);
  await dbConnection.collection("buildings").deleteMany();
});

after(async () => {
  await mongoClient.close();
});

describe("buildingImporter", async function () {

  let dbCollection;

  before(async () => {
    dbCollection = await dbConnection.collection("buildings")
    await execute("test/data/testData.json", mongoUrl);
  });


  describe("successful processing of testData", () => {
    it("should load 2 records into the buildings collection", async () => {
      const actualCount = await dbCollection.countDocuments();
      expect(actualCount).to.equal(4);
    });

    it("should filter out private buildings", async () => {
      const filterOutBuildingsCount = await dbCollection.find({'address.postcode': /M4/}).count()
      expect(filterOutBuildingsCount).to.equal(0);
    });

    it("buildings should contain the expected schema", async () => {
      const expectedBuildingSchema = {
        type: 'object',
        required: ['_id', 'importedDate', 'fullAddress'],
        properties: {
          _id: {
            type: 'integer',
          },
          importedDate: {
            type: 'integer',
          },
          fullAddress: {
            type: 'string',
          },
        }
      }

      const buildingFromDb = await dbCollection.find({'address.postcode': /SE1/})
      buildingFromDb.forEach(building => {
        expect(building).to.be.jsonSchema(expectedBuildingSchema);
      })
    });

    it("full address should not be undefined", async () => {
      const buildingFromDb = await dbCollection.find({'address.postcode': /WC1V/})
      buildingFromDb.forEach(building => {
        expect(building.fullAddress).to.not.contain('undefined')
      })
    });

    it("should contain fullAddress", async () => {
      const file = "test/data/testData.json";
      const fileData = fs.readFileSync(file);
      const data = JSON.parse(fileData).data;
      const testFixtureObj = data.filter(building => building.id === 10001)
      const testFixture = testFixtureObj[0];
      const fullAddress = `${testFixture.name}, ${testFixture.address.line1}, ${testFixture.address.line2}, ${testFixture.address.city}, ${testFixture.address.postcode}`;
      const buildingFromDb = await dbCollection.find({'address.postcode': /SE1/})
      buildingFromDb.forEach(building => {
        expect(building.fullAddress).to.equal(fullAddress)
      })
    });
  });
});
