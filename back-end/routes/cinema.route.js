const express = require("express");
const bodyParser = require("body-parser");
const cinemaRouter = express.Router();

cinemaRouter.use(bodyParser.json());

module.exports = {
    cinemaRouter
};