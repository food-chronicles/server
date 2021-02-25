const QRCode = require("qrcode");
const ejs = require("ejs");
const path = require("path");
const { transporter } = require("../config/mail");

const CLIENT_URL = process.env.CLIENT_URL;
const CLIENT_CMS_URL = process.env.CLIENT_CMS_URL;
const LOGO_FILENAME = process.env.LOGO_FILENAME;

const delay = (retryCount) =>
  new Promise((resolve) => setTimeout(resolve, 10 ** retryCount));

const retrySending = async (email, retryCount = 0, lastError = null) => {
  if (retryCount > 5) throw new Error(lastError);
  try {
    return sendMail(email);
  } catch (e) {
    await delay(retryCount);
    return retrySending(email, retryCount + 1, e);
  }
};

const sendMail = (email) => {
  return transporter.sendMail(email);
};

const sendKey = async (user, product, key) => {
  let url = `${CLIENT_URL}/product/${product.id}`;
  try {
    const qr = await QRCode.toDataURL(url);
    const html = await ejs.renderFile(
      path.resolve("./views/template/sendKey.ejs"),
      { key, qr, url, logo: `${CLIENT_URL}/${LOGO_FILENAME}` }
    );
    const email = {
      from: '"Food Chronicles" <no-reply@food-chornicles.com>', // sender address
      to: user.email,
      subject: `Key for Your Product: ${product.name}`,
      text: `Here is the key for your product: ${key}`,
      html,
    };

    return retrySending(email);
  } catch (err) {
    console.log(err);
  }
};

const sendRegisterMail = async (user) => {
  try {
    const html = await ejs.renderFile(
      path.resolve("./views/template/register.ejs"),
      {
        user: user.username,
        url: CLIENT_CMS_URL,
        logo: `${CLIENT_URL}/${LOGO_FILENAME}`,
      }
    );
    const email = {
      from: '"Food Chronicles" <no-reply@food-chornicles.com>', // sender address
      to: user.email,
      subject: `Welcome to Food Chronicles`,
      text: `Thank you for registering with Food Chronicles. Please visit ${CLIENT_CMS_URL} using your credentials to start using our service.`,
      html,
    };
    return retrySending(email);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { sendKey, sendRegisterMail };
