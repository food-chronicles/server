const QRCode = require("qrcode");
const ejs = require("ejs");
const path = require("path");
const { transporter } = require("../config/mail");

const CLIENT_URL = process.env.CLIENT_URL;
const LOGO_FILENAME = process.env.LOGO_FILENAME;

const delay = (retryCount) =>
  new Promise((resolve) => setTimeout(resolve, 10 ** retryCount));

const retrySending = async (
  user,
  product,
  key,
  html,
  retryCount = 0,
  lastError = null
) => {
  if (retryCount > 5) throw new Error(lastError);
  try {
    return sendMail(user, product, key, html);
  } catch (e) {
    await delay(retryCount);
    return retrySending(user, product, key, html, retryCount + 1, e);
  }
};

const sendMail = (user, product, key, html) => {
  return transporter.sendMail({
    from: '"Food Chronicles" <no-reply@food-chornicles.com>', // sender address
    to: user.email,
    subject: `Key for Your Product: ${product.name}`,
    text: `Here is the key for your product: ${key}`,
    html,
  });
};

const sendKey = (user, product, key) => {
  let url = `${CLIENT_URL}/product/${product.id}`;
  QRCode.toDataURL(url, function (err, qr) {
    if (err) return console.log(err);
    ejs.renderFile(
      path.resolve("./views/template/email.ejs"),
      { key, qr, url, logo: `${CLIENT_URL}/${LOGO_FILENAME}` },
      async function (err, html) {
        if (err) return console.log(err);
        try {
          retrySending(user, product, key, html);
        } catch (err) {
          console.log(err);
        }
      }
    );
  });
};

module.exports = { sendKey };
