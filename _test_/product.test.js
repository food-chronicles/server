const request = require("supertest");
const app = require("../app");

let access_token;

describe("POST /product", () => {
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

  describe("success create new blockchain", () => {
    it("successfully create new blockchain should response with code 201", async (done) => {
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

          expect(res.statusCode).toEqual(201);
          expect(res.body).toHaveProperty("_id");
          expect(typeof res.body._id).toEqual("string");
          expect(res.body).toHaveProperty("chain");
          expect(res.body.chain.length).toEqual(2);
          expect(
            res.body.chain[1].previousHash === res.body.chain[0].hash
          ).toEqual(true);
          expect(res.body.chain[1].data).toEqual(mockProduct.data);
          expect(Array.isArray(res.body.chain)).toEqual(true);
          expect(res.body).toHaveProperty("name");
          expect(typeof res.body.name).toEqual("string");

          done();
        });
    });
  });

  describe("error create new blockchain", () => {
    it("name field is empty should response with code 400", async (done) => {
      const mockProduct = {
        name: "",
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

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toContain("name is required");
          expect(res.body.errors.name.properties.path).toEqual("name");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });

    it("data field is empty should response with code 400 ", async (done) => {
      const mockProduct = {
        name: "Test product",
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {},
        image_url: "test_url",
      };

      request(app)
        .post("/product")
        .send(mockProduct)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("data must not empty");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });

    it("data and name field is empty should response with code 400 ", async (done) => {
      const mockProduct = {
        name: "",
        location: {
          latitude: "-6.9197258999999995",
          longitude: "107.56236159999999",
        },
        data: {},
        image_url: "test_url",
      };

      request(app)
        .post("/product")
        .send(mockProduct)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("data and name must not empty");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });

    it("name field is less than 4 character should response with code 400 ", async (done) => {
      const mockProduct = {
        name: "123",
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

          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toContain("name is min 4 character");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });

    it("request with invalid access token should response with code 401", async (done) => {
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

      const not_access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJub3QgcmVnaXN0ZXIiLCJ1c2VybmFtZSI6Im5vdCB0ZXN0IiwiaWF0IjoxNjEzODUwNDg0fQ.G0eSIylrcBUz7Uguxi18-EqwbH4G7kdSHF6Qgmkv4OE";
      request(app)
        .post("/product")
        .send(mockProduct)
        .set("access_token", not_access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Please login / register first");
          expect(typeof res.body.message).toEqual("string");

          done();
        });
    });
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
    // it("error data is empty should response with code 403", async (done) => {
    //   const mockData = {};

    //   request(app)
    //     .put(`/product/${id}`)
    //     .send(mockData)
    //     .set("access_token", access_token)
    //     .set("key", key)
    //     .end((err, res) => {
    //       if (err) done(err);

    //       console.log(res.body);

    //       expect(res.statusCode).toEqual(403);
    //       expect(res.body).toHaveProperty("message");
    //       expect(res.body.message).toEqual("data must not empty");
    //       expect(typeof res.body.message).toEqual("string");

    //       done();
    //     });
    // });
    it("error key is not match should response with code 403", async (done) => {
      const mockData = {
        amount: 50,
        location: "Jakarta",
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
        amount: 50,
        location: "Jakarta",
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
        amount: 50,
        location: "Jakarta",
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
