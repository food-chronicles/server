const User = require("../models/user");
const mongoose = require("mongoose");

class Controller {
  static register(req, res) {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      company_name: req.body.company_name,
      category: req.body.category,
      history: req.body.history,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static login(req, res) {
    const { username, password } = req.body;
    User.findOne({ username })
      .exec()
      .then((doc) => {
        console.log(doc);
        if (!doc) {
          throw res.status(404).json({ message: "User not found" });
        }
        res.status(201).json(doc);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
}

module.exports = Controller;
