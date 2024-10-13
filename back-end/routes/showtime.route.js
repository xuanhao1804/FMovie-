const express = require("express");
const bodyParser = require("body-parser");
const showtimeRouter = express.Router();

showtimeRouter.use(bodyParser.json());

module.exports = {
    showtimeRouter
};