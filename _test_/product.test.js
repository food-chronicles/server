const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/user");
const { tokenGenerate } = require("../helpers/jwt");
const { createUser } = require("../helpers/createUser");

describe("POST /product", () => {
  describe("success create new blockchain", () => {
    let access_token;
    beforeAll((done) => {
      const mockUser = {
        username: "testSuccess",
        password: "123456",
      };

      request(app)
        .post("/login")
        .send(mockUser)
        .end((err, res) => {
          console.log(res.body);
          access_token = res.body.access_token;
          done();
        });
    });
    it("successfully create new blockchain should response with code 201", async (done) => {
      const mockProduct = {
        amount: 5,
      };

      request(app)
        .post("/product")
        .send(mockProduct)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          console.log(access_token);
          expect(res.statusCode).toEqual(201);
          expect(res.body).toHaveProperty("_id");
          expect(typeof res.body._id).toEqual("string");
          expect(res.body).toHaveProperty("chain");
          expect(res.body.chain.length).toEqual(2);
          expect(
            res.body.chain[1].previousHash === res.body.chain[0].hash
          ).toEqual(true);
          expect(res.body.chain[1].data).toEqual(mockProduct);
          expect(typeof res.body.chain).toEqual("array");
          expect(res.body).toHaveProperty("name");
          expect(typeof res.body.name).toEqual("string");

          done();
        });
    });
  });
});
