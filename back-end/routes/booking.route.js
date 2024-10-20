const express = require("express");
const bookingRoute = express.Router();


const BookingController = require("../controllers/booking.controller");


bookingRoute.post("/receivehook", BookingController.receivehook)
bookingRoute.post("/create-payment", BookingController.CreatePayment)


module.exports = bookingRoute;