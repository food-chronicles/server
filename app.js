// if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const router = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");
const mongodb = require("./config/mongodb");

const app = express();

mongodb.connect();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);
app.use(errorHandler);

module.exports = app;
