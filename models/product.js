const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    require: true,
    minlength: 4,
  },
  chain: Array,
});

module.exports = mongoose.model("Product", productSchema);
