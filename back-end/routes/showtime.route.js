const express = require("express");
const bodyParser = require("body-parser");
const { ShowtimeController } = require("../controllers");
const showtimeRouter = express.Router();

showtimeRouter.use(bodyParser.json());

showtimeRouter.get("/get-all-showtime", ShowtimeController.getShowtimebyDateandMoviesandCinema);

showtimeRouter.get("/get-all", ShowtimeController.getAllShowtime);

module.exports = showtimeRouter;

