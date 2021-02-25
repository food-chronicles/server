const request = require("supertest");
const app = require("../app");
const { checkValidate } = require("../blockchain/checkValidate");

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
      access_token = res.body.access_token;
      done();
    });
});

describe("PUT /product", () => {
  let key;
  let id;
  beforeAll((done) => {
    const mockProduct = {
      name: "Test product",
      location: {
        latitude: "-6.9197258999999995",
        longitude: "107.56236159999999",
      },
      data: {
        amount: 100,
      },
      image_url: "test_url",
    };

    request(app)
      .post("/product")
      .send(mockProduct)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) done(err);

        id = res.body._id;
        key = res.body.chain[1].key;

        done();
      });
  });
  describe("success add new block to blockchain", () => {
    it("success add new block should response with code 200", async (done) => {
      const mockData = {
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {
          amount: 100,
        },
        image_url: "test_url",
      };

      request(app)
        .put(`/product/${id}`)
        .send(mockData)
        .set("access_token", access_token)
        .set("key", key)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("1 doc has been updated");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
  });
  describe("error add new block to blockchain", () => {
    it("error key is not match should response with code 403", async (done) => {
      const mockData = {
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {
          amount: 100,
        },
        image_url: "test_url",
      };

      request(app)
        .put(`/product/${id}`)
        .send(mockData)
        .set("access_token", access_token)
        .set("key", "not key")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(403);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("QR code and key is not match");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
    it("error access_token is invalid should response with code 401", async (done) => {
      const mockData = {
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {
          amount: 100,
        },
        image_url: "test_url",
      };

      request(app)
        .put(`/product/${id}`)
        .send(mockData)
        .set("access_token", "not access_token")
        .set("key", key)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Please login / register first");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
    it("error product not found should response with code 404", async (done) => {
      const mockData = {
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {
          amount: 100,
        },
        image_url: "test_url",
      };
      const not_id = "603196df4bca2bc4f00da608";

      request(app)
        .put(`/product/${not_id}`)
        .send(mockData)
        .set("access_token", access_token)
        .set("key", key)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(404);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Product not found");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
    it("request with compromised or altered data", async (done) => {
      const mockProduct = {
        chain: [
          {
            index: 0,
            timestamp: {
              $date: "2021-02-24T07:37:07.822Z",
            },
            key: null,
            location: "0",
            image_url: "Genesis block",
            user: "Genesis block",
            data: "Genesis block",
            previousHash: "0",
            hash:
              "40d9b4ef5b169ba4aed6c183f4af22430582f171b3b20f31860d8e1d2d4b8a1f",
            nonce: 0,
          },
          {
            index: 1,
            timestamp: {
              $date: "2021-02-24T07:37:08.501Z",
            },
            key: "68k3BaRrDjh6",
            location: {
              latitude: -6.918853,
              longitude: 107.563378,
              city: "Cimahi",
              region: "West Java",
              country: "Indonesia",
            },
            image_url: "test_url1",
            user: {
              id: "603601f2c0e3e61b687ff6c9",
              username: "test20",
              company_name: "test",
              category: "Producer",
              email: "test3@mail.com",
            },
            data: {
              amount: 100,
            },
            previousHash:
              "40d9b4ef5b169ba4aed6c183f4af22430582f171b3b20f31860d8e1d2d4b8a1f",
            hash:
              "3c8dadf4603ae55b05c123c2433dd7b66e1b6619b7d1b1efa1a7c26342915fcd",
            nonce: 0,
          },
        ],
        name: "test product",
        __v: 0,
      };

      const validateStatus = checkValidate(mockProduct);

      expect(validateStatus).toBe(false);

      done();
    });
    it("request with hash is not match", async (done) => {
      const mockProduct = {
        chain: [
          {
            index: 0,
            timestamp: {
              $date: "2021-02-24T07:37:07.822Z",
            },
            key: null,
            location: "0",
            image_url: "Genesis block",
            user: "Genesis block",
            data: "Genesis block",
            previousHash: "0",
            hash:
              "40d9b4ef5b169ba4aed6c183f4af22430582f171b3b20f31860d8e1d2d4b8a1f",
            nonce: 0,
          },
          {
            index: 1,
            timestamp: {
              $date: "2021-02-24T07:37:08.501Z",
            },
            key: "68k3BaRrDjh6",
            location: {
              latitude: -6.918853,
              longitude: 107.563378,
              city: "Cimahi",
              region: "West Java",
              country: "Indonesia",
            },
            image_url: "test_url1",
            user: {
              id: "603601f2c0e3e61b687ff6c9",
              username: "test3",
              company_name: "test",
              category: "Producer",
              email: "test3@mail.com",
            },
            data: {
              amount: 100,
            },
            previousHash:
              "3c8dadf4603ae55b05c123c2433dd7b66e1b6619b7d1b1efa1a7c26342915fcd",
            hash:
              "3c8dadf4603ae55b05c123c2433dd7b66e1b6619b7d1b1efa1a7c26342915fcd",
            nonce: 0,
          },
        ],
        name: "test product",
        __v: 0,
      };

      const validateStatus = checkValidate(mockProduct);

      expect(validateStatus).toBe(false);

      done();
    });
  });
});
