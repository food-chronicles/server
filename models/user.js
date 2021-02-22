const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { hashPassword } = require("../helpers/hashPassword");

const userSchema = new Schema({
  email: {
    type: String,
    required: "email is required",
    unique: "email is already taken",
  },
  username: {
    type: String,
    required: "username is required",
    unique: "username is already taken",
    minlength: [4, "username is min 4 character"],
    maxlength: [100, "username is max 100 character"],
  },
  password: {
    type: String,
    minlength: [4, "password is min 4 character"],
    maxlength: [20, "password is max 20 character"],
    required: "password is required",
  },
  company_name: {
    type: String,
    required: "company is required",
  },
  category: {
    type: String,
    required: "category is required",
    enum: ["Producer", "Manufacture", "Retail"],
  },
  history: {
    type: Array,
    default: [],
    required: "history is required",
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  user.password = hashPassword(user.password);
  next();
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
