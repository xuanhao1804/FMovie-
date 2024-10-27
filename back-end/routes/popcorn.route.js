
const express = require('express');
const popcornController = require('../controllers/popcorn.controller');
const popcornRouter = express.Router();
const uploadCloud = require("../middlewares/UploadCloud");

popcornRouter.get("/get-all", popcornController.getAllPopcorn);
popcornRouter.post("/create", uploadCloud.single('image'), popcornController.CreateNewPopCorn);
popcornRouter.post("/update", uploadCloud.single('image'), popcornController.EditPopCorn);
popcornRouter.delete("/delete/:id", popcornController.DeletePopCorn);
module.exports = popcornRouter;

