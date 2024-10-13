const express = require("express");
const bodyParser = require("body-parser");
const roomRouter = express.Router();

roomRouter.use(bodyParser.json());

module.exports = {
    roomRouter
};