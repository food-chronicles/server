const express = require("express");

const router = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");
const mongodb = require("./config/mongodb");

const app = express();

mongodb.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);
app.use(errorHandler);

module.exports = app;
