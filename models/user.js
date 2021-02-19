const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  username: {
    type: String,
    require: true,
    minlength: 4,
    maxlength: 100,
  },
  password: {
    type: String,
    require: true,
    minlength: 4,
    maxlength: 20,
  },
  company_name: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Producer", "Manufacture", "Retail"],
  },
  history: Array,
});

module.exports = mongoose.model("User", userSchema);
