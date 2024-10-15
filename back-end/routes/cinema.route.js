
const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const { cinema } = require('../models');
const cinemaRouter = express.Router();

cinemaRouter.get("/get-all",cinemaController.getAllCinema );
<<<<<<< HEAD

cinemaRouter.get("/get-by-city/:id",cinemaController.getCinemaByCity );

module.exports = cinemaRouter;
=======

cinemaRouter.get("/get-by-city/:id",cinemaController.getCinemaByCity );

module.exports = cinemaRouter;

>>>>>>> dde8a87f72de5c55b187a16851633be527c7f1d6
