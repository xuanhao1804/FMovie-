
const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const { cinema } = require('../models');
const cinemaRouter = express.Router();

cinemaRouter.get("/get-all",cinemaController.getAllCinema );
<<<<<<< HEAD

cinemaRouter.get("/get-by-city/:id",cinemaController.getCinemaByCity );

module.exports = cinemaRouter;
<<<<<<< HEAD
=======

cinemaRouter.get("/get-by-city/:id",cinemaController.getCinemaByCity );

module.exports = cinemaRouter;

>>>>>>> dde8a87f72de5c55b187a16851633be527c7f1d6
=======

>>>>>>> aefac208b30f52d76ab6b9fcec9e76a55004dba8
