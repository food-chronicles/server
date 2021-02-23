const nodemailer = require("nodemailer");

let transporter;

const createAccount = () => {
  return nodemailer.createTestAccount();
};

const mailInit = async () => {
  const mailAccount = await createAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: mailAccount.user, // generated ethereal user
      pass: mailAccount.pass, // generated ethereal password
    },
  });
};

const getTransporter = () => {
  return transporter;
};

module.exports = { mailInit, getTransporter };
