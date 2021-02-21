const { checkToken } = require("../helpers/jwt");
const User = require("../models/user");

const authentication = async (req, res, next) => {
  try {
    const decoded = checkToken(req.headers.access_token);
    const username = decoded.username;
    const user = await User.findOne({ username }).exec();
    // console.log(user);
    if (user) {
      req.headers.user = {
        id: user.id,
        username: user.username,
      };
      next();
    } else {
      next({ name: "Unauthorized" });
    }
  } catch (err) {
    next({ name: "Unauthorized" });
  }
};

module.exports = authentication;
