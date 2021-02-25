const request = require("supertest");
const app = require("../app");

describe("GET /product/:id", () => {
  describe("success get product details", () => {
    it("should successfully get product details", async (done) => {
      request(app)
        .get("/product/602c5b7467c504683aa66004")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("_id");
          expect(res.body).toHaveProperty("name");
          expect(res.body).toHaveProperty("chain");
          expect(typeof res.body.chain).toEqual("object");
          expect(Array.isArray(res.body.chain)).toEqual(true);
          expect(res.body.chain[0]).toHaveProperty("timestamp");
          expect(res.body.chain[0]).toHaveProperty("data");

          done();
        });
    });
  });

  describe("failed to get product details", () => {
    it("should return 404 not found for invalid product id", async (done) => {
      request(app)
        .get("/product/602c5b7467c504693aa66004")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(404);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Product not found");

          done();
        });
    });

    it("should return 404 not found for invalid product id", async (done) => {
      request(app)
        .get("/product/random")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(404);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("Product not found");

          done();
        });
    });
  });
});
