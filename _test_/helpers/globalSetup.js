// setup.js
const path = require("path");
const fs = require("fs");
const jestMongoSetup = require("@shelf/jest-mongodb/setup");
const { MongoClient } = require("mongodb");
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
    history: [],
  };

  await users.insertOne(user);
  await connection.close();
};
