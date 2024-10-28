const express = require("express");
const bookingRoute = express.Router();
const bodyParser = require("body-parser");

const BookingController = require("../controllers/booking.controller");
bookingRoute.use(bodyParser.json());

bookingRoute.post("/receivehook", BookingController.receiveHook)

bookingRoute.get("/getbooking", BookingController.getBooking)
bookingRoute.post("/create-payment", BookingController.CreatePayment)
bookingRoute.get("/get-all", BookingController.GetAllBookingAdmin)

module.exports = bookingRoute;