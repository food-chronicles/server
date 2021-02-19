const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const router = require("./routers/index");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/final-projectdb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`This app is running at ${port}`);
});
