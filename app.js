const express = require("express");
const app = express();
const router = require("./routers/index");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost:27017/final-projectdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(router);

module.exports = app;
