const { MongoClient } = require("mongodb");
const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../app");

describe("POST /register", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);

    const users = db.collection("users");
    const user = {
      email: "test@food-chronicles.com",
      username: "testUser",
      password: bcrypt.hashSync("123456", bcrypt.genSaltSync(10)),
      company_name: "Test Company",
      category: "Distributor",
    };

    await users.insertOne(user);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });
  describe("User Register Success", function () {
    it("should return response 201 with access_token and user details", async () => {
      // Setup
      const userData = {
        email: "test-success@food-chronicles.com",
        username: "testSuccess",
        password: "123456",
        company_name: "Food Company",
        category: "Distributor",
      };

      // Execute
      request(app)
        .post("/register")
        .send(userData)
        .end(function (err, res) {
          if (err) done(err);

          // Assert
          expect(res.statusCode).toEqual(201);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("access_token");
          expect(typeof res.body.access_token).toEqual("string");
          expect(res.body).toHaveProperty("id");
          expect(typeof res.body.id).toEqual("string");
          expect(res.body).toHaveProperty("username");
          expect(res.body.username).toEqual(userData.username);
          expect(res.body).toHaveProperty("email");
          expect(res.body.email).toEqual(body.email);
          expect(res.body).toHaveProperty("company_name");
          expect(res.body.company_name).toEqual(body.company_name);
          expect(res.body).toHaveProperty("category");
          expect(res.body.category).toEqual(body.category);

          done();
        });
    });
  });

  describe("User Failed to Register", function () {
    it("should return response 400 with validation error details", function (done) {
      // Setup
      const userData = {
        email: "",
        username: "",
        password: "",
        company_name: "",
        category: "",
      };

      // Execute
      request(app)
        .post("/register")
        .send(userData)
        .end(function (err, res) {
          if (err) done(err);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("errors");
          expect(Array.isArray(res.body.errors)).toEqual(true);
          expect(res.body.errors).toEqual(
            expect.arrayContaining([
              "Email is required",
              "Username is required",
              "Password is required",
              "Company name is required",
              "Category is required",
            ])
          );

          done();
        });
    });

    it("should return response 400 with email unique validation error details", function (done) {
      // Setup
      const userData = {
        email: "test@food-chronicles.com",
        username: "test",
        password: "123456",
        company_name: "Company",
        category: "Distributor",
      };

      // Execute
      request(app)
        .post("/register")
        .send(userData)
        .end(function (err, res) {
          if (err) done(err);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("errors");
          expect(Array.isArray(res.body.errors)).toEqual(true);
          expect(res.body.errors).toEqual(
            expect.arrayContaining(["Email already in use"])
          );

          done();
        });
    });

    it("should return response 400 with username unique validation error details", function (done) {
      // Setup
      const userData = {
        email: "test-failed@food-chronicles.com",
        username: "testUser",
        password: "123456",
        company_name: "Company",
        category: "Distributor",
      };

      // Execute
      request(app)
        .post("/register")
        .send(userData)
        .end(function (err, res) {
          if (err) done(err);

          // Assert
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("errors");
          expect(Array.isArray(res.body.errors)).toEqual(true);
          expect(res.body.errors).toEqual(
            expect.arrayContaining(["Username already in use"])
          );

          done();
        });
    });
  });
});
