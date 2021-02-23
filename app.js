const env = process.env.NODE_ENV || "development";
if (env === "development" || env === "test") require("dotenv").config();

const express = require("express");
const cors = require("cors");

const router = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");
const mongodb = require("./config/mongodb");
const { mailInit } = require("./config/mail");

const app = express();

mongodb.connect();
mailInit();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);
app.use(errorHandler);

module.exports = app;
