// setup.js
const path = require("path");
const fs = require("fs");
const jestMongoSetup = require("@shelf/jest-mongodb/setup");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const cwd = process.cwd();
const globalConfigPath = path.join(cwd, "globalConfig.json");

module.exports = async () => {
  await jestMongoSetup();

  const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, "utf-8"));

  let connection;
  let db;

  connection = await MongoClient.connect(globalConfig.mongoUri, {
    useNewUrlParser: true,
  });
  db = await connection.db(globalConfig.mongoDBName);

  const users = db.collection("users");
  const user = {
    email: "test@food-chronicles.com",
    username: "testUser",
    password: bcrypt.hashSync("123456", bcrypt.genSaltSync(10)),
    company_name: "Test Company",
    category: "Producer",
    history: [
      { _id: new ObjectId("602c5b7467c504683aa66004"), name: "Chicken" },
      { _id: new ObjectId("602c5a5c67c504683aa66003"), name: "For Search" },
    ],
  };

  const products = db.collection("products");
  const product = {
    _id: new ObjectId("602c5b7467c504683aa66004"),
    name: "Chicken",
    chain: [
      {
        index: 0,
        timestamp: "2021-02-21T15:57:36.869Z",
        key: "0",
        data: "Genesis block",
        previousHash: "0",
        hash:
          "4919ce51251fe8a674cd1ea4a93d43fbaceedd7c520cd98e484247d7a4294e20",
        nonce: 0,
      },
      {
        index: 1,
        timestamp: "2021-02-21T15:57:36.872Z",
        key: "7vz2VmK5WPDe",
        data: {
          amount: 5,
        },
        previousHash:
          "4919ce51251fe8a674cd1ea4a93d43fbaceedd7c520cd98e484247d7a4294e20",
        hash:
          "dea41e2449fc79342f09f1bfbed6549194b67ccc93e33bd7e7de1d8e095057dd",
        nonce: 0,
      },
    ],
  };

  await users.insertOne(user);
  await products.insertOne(product);
  await connection.close();
};
