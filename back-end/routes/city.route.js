const express = require('express');
const cityController = require('../controllers/city.controller');
const cityRouter = express.Router();

cityRouter.get("/get-all",cityController.getAllCity );

module.exports = cityRouter;
