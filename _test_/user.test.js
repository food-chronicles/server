const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { compare } = require("../helpers/hashPassword");

describe("POST /register", () => {
  describe("User register success", () => {
    it("register user successfully response with status 201", async (done) => {
      const mockUser = {
        email: "test-success@food-chronicles.com",
        username: "testSuccess",
        password: "123456",
        company_name: "Food Company",
        category: "Producer",
      };

      request(app)
        .post("/register")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(201);
          expect(typeof res.body._id).toEqual("string");
          expect(res.body).toHaveProperty("access_token");
          expect(typeof res.body.access_token).toEqual("string");
          expect(res.body).toHaveProperty("email");
          expect(res.body.email).toBe(mockUser.email);
          expect(typeof res.body.email).toEqual("string");
          expect(res.body).toHaveProperty("username");
          expect(res.body.username).toBe(mockUser.username);
          expect(typeof res.body.username).toEqual("string");
          expect(res.body).toHaveProperty("password");
          expect(compare(mockUser.password, res.body.password)).toEqual(true);
          expect(typeof res.body.password).toEqual("string");
          expect(res.body).toHaveProperty("company_name");
          expect(res.body.company_name).toBe(mockUser.company_name);
          expect(typeof res.body.company_name).toEqual("string");
          expect(res.body).toHaveProperty("category");
          expect(res.body.category).toBe(mockUser.category);
          expect(typeof res.body.category).toEqual("string");
          expect(res.body).toHaveProperty("history");
          expect(Array.isArray(res.body.history)).toBe(true);

          done();
        });
    });
  });

  describe("User register error", () => {
    it("register user validation field error, email and username must be unique field should response with status 400", async (done) => {
      const mockUser = {
        email: "test@food-chronicles.com",
        username: "testUser",
        password: "1234",
        company_name: "Test Company",
        category: "Producer",
      };
      request(app)
        .post("/register")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body.errors).toHaveProperty("email");
          expect(res.body.errors.email.kind).toEqual("unique");
          expect(res.body.errors.email.path).toEqual("email");
          expect(res.body.errors).toHaveProperty("username");
          expect(res.body.errors.username.kind).toEqual("unique");
          expect(res.body.errors.username.path).toEqual("username");
          expect(res.body.name).toEqual("ValidationError");
          expect(res.body.message).toContain("already taken");

          done();
        });
    });

    it("register user empty field, should response with status 400", async (done) => {
      const mockUser = {
        email: "",
        username: "",
        password: "",
        company_name: "",
        category: "",
      };

      request(app)
        .post("/register")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body.errors).toHaveProperty("email");
          expect(res.body.errors.email.kind).toEqual("required");
          expect(res.body.errors.email.path).toEqual("email");
          expect(res.body.errors).toHaveProperty("username");
          expect(res.body.errors.username.kind).toEqual("required");
          expect(res.body.errors.username.path).toEqual("username");
          expect(res.body.errors).toHaveProperty("password");
          expect(res.body.errors.password.kind).toEqual("required");
          expect(res.body.errors.password.path).toEqual("password");
          expect(res.body.errors).toHaveProperty("company_name");
          expect(res.body.errors.company_name.kind).toEqual("required");
          expect(res.body.errors.company_name.path).toEqual("company_name");
          expect(res.body.errors).toHaveProperty("category");
          expect(res.body.errors.category.kind).toEqual("required");
          expect(res.body.errors.category.path).toEqual("category");
          expect(res.body.name).toEqual("ValidationError");
          expect(res.body.message).toContain("required");

          done();
        });
    });

    it("register user category is not one of (Producer, Manufacture, Retail), should response with status 400", async (done) => {
      const mockUser = {
        email: "mockuser@mail.com",
        username: "John",
        password: "1234",
        company_name: "mock company",
        category: "Not one of the choice",
      };

      request(app)
        .post("/register")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body.errors).toHaveProperty("category");
          expect(res.body.errors.category.kind).toEqual("enum");
          expect(res.body.errors.category.properties.enumValues).toEqual([
            "Producer",
            "Manufacture",
            "Retail",
          ]);
          expect(res.body.errors.category.path).toEqual("category");
          expect(res.body.name).toEqual("ValidationError");
          expect(res.body.message).toContain("valid enum value");

          done();
        });
    });
  });
});

describe("POST /login", () => {
  describe("User login success", () => {
    it("login user successfully response with status 200", async (done) => {
      const mockUser = {
        username: "testSuccess",
        password: "123456",
      };

      request(app)
        .post("/login")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty("access_token");
          expect(typeof res.body.access_token).toEqual("string");

          done();
        });
    });
  });

  describe("User login error", () => {
    it("username not found or password is wrong 400", async (done) => {
      const mockUser = {
        username: "not John",
        password: "not 1234",
      };
      request(app)
        .post("/login")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Invalid Username or Password");

          done();
        });
    });
  });
});

describe("GET /user", () => {
  describe("Get user info success", () => {
    let access_token;

    beforeAll(async (done) => {
      const mockUser = {
        username: "testUser",
        password: "123456",
      };

      request(app)
        .post("/login")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);
          access_token = res.body.access_token;
          done();
        });
    });

    it("should successfully get user info with status 200", async (done) => {
      request(app)
        .get("/user")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("email");
          expect(typeof res.body.email).toEqual("string");
          expect(res.body).toHaveProperty("username");
          expect(typeof res.body.username).toEqual("string");
          expect(res.body).toHaveProperty("company_name");
          expect(typeof res.body.company_name).toEqual("string");
          expect(res.body).toHaveProperty("category");
          expect(typeof res.body.category).toEqual("string");

          done();
        });
    });
  });

  describe("Get user info failed", () => {
    it("should failed to get user info when not providing access_token", async (done) => {
      request(app)
        .get("/user")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Please login / register first");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });

    it("should failed to get user info when providing invalid access_token", async (done) => {
      request(app)
        .get("/user")
        .set("access_token", "not access token")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Please login / register first");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
  });
});
