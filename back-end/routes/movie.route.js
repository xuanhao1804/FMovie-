const express = require("express");
const bodyParser = require("body-parser");
const { checkUserJWT } = require("../middlewares/JsonWebToken");
const {MovieController} = require("../controllers");
const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

movieRouter.get("/get-all", MovieController.getAllMovie);

module.exports = {
  movieRouter
};
