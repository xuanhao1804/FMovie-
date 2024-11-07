const express = require("express");
const bookingRoute = express.Router();
const bodyParser = require("body-parser");

const BookingController = require("../controllers/booking.controller");
bookingRoute.use(bodyParser.json());

bookingRoute.post("/receivehook", BookingController.receiveHook)

bookingRoute.get("/getbooking", BookingController.getBooking)
bookingRoute.get("/get-all", BookingController.GetAllBookingAdmin)
bookingRoute.post("/create-payment", BookingController.CreatePayment)
bookingRoute.post("/get-booked-seats", BookingController.getBookedSeats)
bookingRoute.post("/get-history", BookingController.getUserBookedHistory)
bookingRoute.post("/get-ticket", BookingController.getUserTicket)
bookingRoute.get('/get-revenue', BookingController.getTotalBookingPrice)

module.exports = bookingRoute;