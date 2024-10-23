
const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const cinemaRouter = express.Router();

cinemaRouter.get("/get-all", cinemaController.getAllCinema);

cinemaRouter.get("/get-by-city/:id", cinemaController.getCinemaByCity);

cinemaRouter.get("/get-by-city/:id", cinemaController.getCinemaByCity);

cinemaRouter.get("/get-movies-by-cinema/:cinemaId", cinemaController.getMoviesByCinema);



cinemaRouter.get('/get-showtimes', cinemaController.getShowtimesByCinema);
module.exports = cinemaRouter;

