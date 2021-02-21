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
    history: [
      { _id: "602c5b7467c504683aa66004", name: "Chicken" },
      { _id: "602c5a5c67c504683aa66003", name: "For Search" },
    ],
  };

  await users.insertOne(user);
  await connection.close();
};
