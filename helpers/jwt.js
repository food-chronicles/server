const jwt = require("jsonwebtoken");
let SECRET_KEY = "test";

function tokenGenerate(payload) {
  return jwt.sign(payload, SECRET_KEY);
}

function checkToken(token) {
  return jwt.decode(token, SECRET_KEY);
}

module.exports = {
  tokenGenerate,
  checkToken,
};
