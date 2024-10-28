const express = require("express");
const bodyParser = require("body-parser");
const RoomController = require("../controllers/room.controller")

const roomRouter = express.Router();
roomRouter.use(bodyParser.json());

roomRouter.post("/detail", RoomController.getRoomByID);

module.exports = roomRouter;

