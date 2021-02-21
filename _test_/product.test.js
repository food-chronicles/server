const request = require("supertest");
const app = require("../app");

describe("POST /product", () => {
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
        // console.log("beforeall", res.body);
        access_token = res.body.access_token;
        done();
      });
  });

  describe("success create new blockchain", () => {
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

          // console.log("post", res.body);
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
