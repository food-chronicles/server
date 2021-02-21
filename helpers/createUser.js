const User = require("../models/user");

function createUser(payload) {
  if (process.env.NODE_ENV === "test") {
    return User.create(payload);
  }
}

function clearUsers() {
  if (process.env.NODE_ENV === "test") {
    return User.destroy({ where: [] });
  }
}

module.exports = {
  clearUsers,
  createUser,
};
