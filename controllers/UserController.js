const User = require("../models/user");
const { compare } = require("../helpers/hashPassword");
const { tokenGenerate } = require("../helpers/jwt");

class Controller {
  static register(req, res) {
    const {
      email,
      username,
      password,
      company_name,
      category,
      history,
    } = req.body;
    const user = new User({
      email,
      username,
      password,
      company_name,
      category,
      history: [],
    });
    user
      .save()
      .then((result) => {
        const {
          _id,
          email,
          username,
          password,
          company_name,
          category,
          history,
        } = result;
        const payload = {
          _id,
          username,
        };
        const access_token = tokenGenerate(payload);
        const response = {
          _id,
          email,
          username,
          password,
          company_name,
          category,
          history,
          access_token,
        };
        res.status(201).json(response);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  static login(req, res) {
    const { username, password } = req.body;
    User.findOne({ username })
      .exec()
      .then((doc) => {
        if (doc && compare(password, doc.password)) {
          const { _id, username } = doc;
          const payload = {
            _id,
            username,
          };
          const access_token = tokenGenerate(payload);
          res.status(200).json({ access_token });
        } else {
          throw { type: "invalid username or password" };
        }
      })
      .catch((err) => {
        if (err.type) {
          res.status(400).json({ message: "Invalid Username or Password" });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }
}

module.exports = Controller;
