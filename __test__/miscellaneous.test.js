const nodemailer = require("nodemailer");
const { sendKey } = require("../service/mail");
jest.mock("nodemailer");

describe("Mail Service Test", () => {
  describe("Failed Service Test", () => {
    it("should return undefined", async (done) => {
      nodemailer.createTransport.mockResolvedValue(null);

      const res = await sendKey("user.email", "product.name", "key");
      expect(res).toBeUndefined();

      done();
    });
  });
});
