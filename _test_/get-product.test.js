const request = require("supertest");
const app = require("../app");

describe("GET /product", () => {
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

  describe("success get products list", () => {
    it("successfully get a list of registered product", async (done) => {
      request(app)
        .get("/product")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(Array.isArray(res.body)).toEqual(true);
          expect(res.body[0]).toHaveProperty("_id");
          expect(res.body[0]).toHaveProperty("name");

          done();
        });
    });

    it("successfully filter registered product by id", async (done) => {
      let uri = encodeURI("/product?search=602c5b7467c504683aa66004");
      request(app)
        .get(uri)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(Array.isArray(res.body)).toEqual(true);
          expect(res.body[0]).toHaveProperty("_id");
          expect(res.body[0]._id).toEqual("602c5b7467c504683aa66004");
          expect(res.body[0]).toHaveProperty("name");
          expect(res.body[0].name).toEqual("Chicken");

          done();
        });
    });

    it("successfully filter registered product by name", async (done) => {
      let uri = encodeURI("/product?search=search");
      request(app)
        .get(uri)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(Array.isArray(res.body)).toEqual(true);
          expect(res.body[0]).toHaveProperty("_id");
          expect(res.body[0]._id).toEqual("602c5a5c67c504683aa66003");
          expect(res.body[0]).toHaveProperty("name");
          expect(res.body[0].name).toEqual("For Search");

          done();
        });
    });
  });

  describe("failed to get products list", () => {
    it("should return 401 for request without access token", async (done) => {
      request(app)
        .get("/product")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Please login / register first");

          done();
        });
    });
  });
});
