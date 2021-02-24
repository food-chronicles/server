const nodemailer = require("nodemailer");
const { sendKey, retrySending } = require("../service/mail");
jest.mock("nodemailer");
jest.useFakeTimers();

describe("Mail Service Test", () => {
  describe("Failed Service Test", () => {
    it("should failed sending email", async () => {
      const sendMailMock = jest.fn(() => {
        return Promise.reject(new Error("mock"));
      });
      nodemailer.createTransport.mockReturnValue({
        sendMail: sendMailMock,
      });

      // sendKey("user.email", "product.name", "key");
      await retrySending({});
      // expect(retrySending({})).rejects.toThrow("mock");
      jest.runAllTimers();
      // function flushPromises() {
      //   return new Promise((resolve) => setImmediate(resolve));
      // }

      // jest.advanceTimersByTime(1000000);
      // await flushPromises();
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();

      expect(setTimeout).toHaveBeenCalledTimes(2);
      // expect(res).toBeUndefined();
    });
  });
});
