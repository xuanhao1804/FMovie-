const express = require("express");
const bodyParser = require("body-parser");
const { checkUserJWT } = require("../middlewares/JsonWebToken");
const { MovieController } = require("../controllers");
const uploadCloud = require("../middlewares/UploadCloud");
const movieRouter = express.Router();

movieRouter.use(bodyParser.json());

movieRouter.get("/get-all", MovieController.getAllMovie);
movieRouter.post("/create", uploadCloud.single('image'), MovieController.CreatnewMovie);
movieRouter.put("/update/:id", MovieController.Editmovie);
movieRouter.get("/detail/:id", MovieController.getMovieByID)
movieRouter.delete("/delete/:id", MovieController.Deletemovie)




module.exports = movieRouter
    ;
