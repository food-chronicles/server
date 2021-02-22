const request = require("supertest");
const app = require("../app");

describe("GET /ping", () => {
  describe("Test if the server is running", () => {
    it("should return pong", async (done) => {
      request(app)
        .get("/ping")
        .end((err, res) => {
          if (err) done(err);

          expect(res.statusCode).toEqual(200);
          expect(res.text).toEqual("pong");

          done();
        });
    });
  });
});
