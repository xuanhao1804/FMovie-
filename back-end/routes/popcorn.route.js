
const express = require('express');
const popcornController = require('../controllers/popcorn.controller');
const popcornRouter = express.Router();

popcornRouter.get("/get-all", popcornController.getAllPopcorn);

module.exports = popcornRouter;

