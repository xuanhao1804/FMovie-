
const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const cinemaRouter = express.Router();

cinemaRouter.get("/get-all", cinemaController.getAllCinema);

cinemaRouter.get("/get-by-city/:id", cinemaController.getCinemaByCity);

cinemaRouter.post("/create", cinemaController.CreateNewCinema);

cinemaRouter.get("/get-movies-by-cinema/:cinemaId", cinemaController.getMoviesByCinema);

cinemaRouter.post("/get-rooms", cinemaController.getRoomByCinema);

cinemaRouter.get('/get-showtimes', cinemaController.getShowtimesByCinema);

cinemaRouter.get('/movies/:cinemaId', cinemaController.getMoviesAndShowtimesByCinema);
module.exports = cinemaRouter;

