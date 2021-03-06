const User = require("../models/user");
const { compare } = require("../helpers/hashPassword");
const { tokenGenerate } = require("../helpers/jwt");
const { sendRegisterMail } = require("../service/mail");

class Controller {
  static register(req, res, next) {
    const { email, username, password, company_name, category } = req.body;
    const user = new User({
      email,
      username,
      password,
      company_name,
      category,
    });
    user
      .save()
      .then(
        ({
          _id,
          email,
          username,
          password,
          company_name,
          category,
          history,
        }) => {
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
          sendRegisterMail(user);
          res.status(201).json(response);
        }
      )
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
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
          return next({ name: "InvalidLogin" });
        }
      })
      .catch(next);
  }

  static async getUserInfo(req, res, next) {
    try {
      const { id } = req.headers.user;
      const {
        _id,
        email,
        username,
        company_name,
        category,
      } = await User.findById(id);

      res.status(200).json({ _id, email, username, company_name, category });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserInfo(req, res, next) {
    try {
      const { id } = req.headers.user;
      const { email, username, company_name, category } = req.body;
      const result = await User.where({ _id: id })
        .updateOne({
          email,
          username,
          company_name,
          category,
        })
        .exec();
      const payload = {
        id,
        username,
      };
      const access_token = tokenGenerate(payload);
      res.status(200).json({
        message: `${result.n} doc has been updated`,
        updatedData: {
          id,
          email,
          username,
          company_name,
          category,
        },
        access_token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
