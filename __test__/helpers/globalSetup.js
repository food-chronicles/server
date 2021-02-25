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

  const productsCollection = db.collection("products");
  const products = [
    {
      chain: [
        {
          index: 0,
          timestamp: "2021-02-23T23:58:38.313Z",
          location: "0",
          image_url: "Genesis block",
          user: "Genesis block",
          data: "Genesis block",
          previousHash: "0",
          hash:
            "a675875692885f8189601fa772766e642ecc3a48d14048b566c6d20161be4064",
          nonce: 0,
        },
        {
          index: 1,
          timestamp: "2021-02-23T23:58:39.252Z",
          key: "HXk98S2HRmY5",
          location: {
            latitude: -6.918853,
            longitude: 107.563378,
            city: "Cimahi",
            region: "West Java",
            country: "Indonesia",
          },
          image_url: "test_url",
          user: {
            id: "60359605cab3f91d9e6c43cf",
            email: "test@food-chronicles.com",
            username: "testUser",
            company_name: "Test Company",
            category: "Producer",
          },
          data: {
            amount: 100,
          },
          previousHash:
            "a675875692885f8189601fa772766e642ecc3a48d14048b566c6d20161be4064",
          hash:
            "cf8cde93ea44322300c6c58932b9cce6bf68ea5c42650afda2dc891dbd68f04b",
          nonce: 0,
        },
      ],
      _id: new ObjectId("602c5b7467c504683aa66004"),
      name: "Chicken",
      __v: 0,
    },
    {
      chain: [
        {
          index: 0,
          timestamp: "2021-02-24T00:00:46.355Z",
          location: "0",
          image_url: "Genesis block",
          user: "Genesis block",
          data: "Genesis block",
          previousHash: "0",
          hash:
            "4142918804b35758e742cf96ed7b80d361a4e7dd158ff6f4b7a82ca5a74922c7",
          nonce: 0,
        },
        {
          index: 1,
          timestamp: "2021-02-24T00:00:46.985Z",
          key: "3RczcVdaHyG5",
          location: {
            latitude: -6.918853,
            longitude: 107.563378,
            city: "Cimahi",
            region: "West Java",
            country: "Indonesia",
          },
          image_url: "test_url2",
          user: {
            id: "60359605cab3f91d9e6c43cf",
            email: "test@food-chronicles.com",
            username: "testUser",
            company_name: "Test Company",
            category: "Producer",
          },
          data: {
            amount: 10,
          },
          previousHash:
            "4142918804b35758e742cf96ed7b80d361a4e7dd158ff6f4b7a82ca5a74922c7",
          hash:
            "94bd7a28764cccc5d015ab99fe23c2be35373f4de18fa9c61f8c62e689b6234c",
          nonce: 0,
        },
      ],
      _id: new ObjectId("602c5a5c67c504683aa66003"),
      name: "For Search",
      __v: 0,
    },
  ];

  await users.insertOne(user);
  await productsCollection.insertMany(products);
  await connection.close();
};
