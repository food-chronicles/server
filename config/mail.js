const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASS, // generated ethereal password
  },
});

module.exports = { transporter };
