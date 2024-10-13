const express = require("express");
const bodyParser = require("body-parser");
const cityRouter = express.Router();

cityRouter.use(bodyParser.json());

module.exports = {
    cityRouter
};