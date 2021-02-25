// const nodemailer = require("nodemailer");
const request = require("supertest");
const app = require("../app");
// const { sendKey } = require("../service/mail");
const User = require("../models/user");

// jest.mock("nodemailer", () => {
//   return {
//     createTransport: jest.fn(() => {}),
//   };
// });
// jest.useFakeTimers();

// describe("Mail Service Test", () => {
//   describe("Failed Service Test", () => {
//     it("should failed sending email", async () => {
//       await sendKey("user.email", "product.name", "key");
//       jest.runAllTimers();

//       expect(setTimeout).toHaveBeenCalledTimes(6);
//     });
//   });
// });

describe("Controller Test", () => {
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

  describe("Failed Service Test", () => {
    it("should failed fetching products", async (done) => {
      User.findById = jest.fn();
      User.findById.mockRejectedValue("Mock Error");

      request(app)
        .get("/product")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(500);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Server Error");

          done();
        });
    });

    it("password is wrong 400", async (done) => {
      const mockUser = {
        username: "testUser",
        password: "not 1234",
      };
      process.env.NODE_ENV = "development";
      request(app)
        .post("/login")
        .send(mockUser)
        .end((err, res) => {
          if (err) done(err);
          process.env.NODE_ENV = "test";

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Invalid Username or Password");

          done();
        });
    });
  });
});
