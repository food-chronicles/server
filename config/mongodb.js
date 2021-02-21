const mongoose = require("mongoose");

const MONGO_URI =
  (process.env.NODE_ENV !== "test"
    ? process.env.MONGO_URI
    : global.__MONGO_URI__) || "mongodb://localhost/fc_dev";

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongo connected to ${MONGO_URI}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect };
