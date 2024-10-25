
const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const cinemaRouter = express.Router();

cinemaRouter.get("/get-all", cinemaController.getAllCinema);

cinemaRouter.get("/get-by-city/:id", cinemaController.getCinemaByCity);

cinemaRouter.get("/getshowtimebyid/:id", cinemaController.GetAllshowtimeCinemaById);

cinemaRouter.get("/get-movies-by-cinema/:cinemaId", cinemaController.getMoviesByCinema);
cinemaRouter.post("/create", cinemaController.CreateNewCinema);
cinemaRouter.put('/update/:id', cinemaController.EditCinema);
cinemaRouter.delete('/delete/:id', cinemaController.deleteCinema);
cinemaRouter.get('/get-showtimes', cinemaController.getShowtimesByCinema);
module.exports = cinemaRouter;

