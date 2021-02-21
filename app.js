const express = require("express");
const app = express();
const router = require("./routers/index");

const mongodb = require("./config/mongodb");

mongodb.connect();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(router);

module.exports = app;
