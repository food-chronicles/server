const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 4,
  },
  chain: Array,
});

module.exports = mongoose.model("Product", productSchema);
