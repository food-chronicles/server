const request = require("supertest");
const app = require("../app");

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
  });
});
