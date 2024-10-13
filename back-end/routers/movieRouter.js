const express = require("express");
const bodyParser = require("body-parser");
const { checkUserJWT } = require("../middlewares/JsonWebToken");
const MovieController = require("../controllers/MovieController");
const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

movieRouter.get("/get-all", MovieController.getAllMovie);
movieRouter.get("/detail/:id", MovieController.getMovieByID)

module.exports = {
  movieRouter
};
