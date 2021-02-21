const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { hashPassword } = require("../helpers/hashPassword");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 100,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Producer", "Manufacture", "Retail"],
  },
  history: {
    type: Array,
    required: true,
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
