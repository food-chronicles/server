const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: "name is required",
    minlength: [4, "name is min 4 character"],
  },
  chain: {
    type: Array,
    required: "chain is required",
  },
});

module.exports = mongoose.model("Product", productSchema);
