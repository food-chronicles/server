const nodemailer = require("nodemailer");
const { transporter } = require("../config/mail");

const delay = (retryCount) =>
  new Promise((resolve) => setTimeout(resolve, 10 ** retryCount));

const retrySending = async (
  to,
  product,
  key,
  retryCount = 0,
  lastError = null
) => {
  if (retryCount > 5) throw new Error(lastError);
  try {
    return sendMail(to, product, key);
  } catch (e) {
    await delay(retryCount);
    return retrySending(to, product, key, retryCount + 1, e);
  }
};

const sendMail = (to, product, key) => {
  return transporter.sendMail({
    from: '"Food Chronicles" <no-reply@food-chornicles.com>', // sender address
    to: to,
    subject: `Key for ${product}`,
    text: `Here is the key for your product: ${key}`,
    html: `<b>${key}</b>`, // html body
  });
};

const sendKey = (to, product, key) => {
  retrySending(to, product, key).catch(console.log);
};

module.exports = { sendKey };
