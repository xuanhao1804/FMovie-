const mongoose = require("mongoose");
const Movie = require("./movie.model");
const City = require("./city.model");
const Cinema = require("./cinema.model");
const Room = require("./room.model");
const Showtime = require("./showtime.model");
const Showtime_seat = require("./showtime_seat.model");
const Booking = require("./booking.model")
const Ticket = require ("./ticket.model")
const Seat = require("./Seat.model")



mongoose.Promise = global.Promise;

const db = {};

// db.user = User
db.movie = Movie
db.city = City
db.cinema = Cinema
db.room = Room  
db.showtime = Showtime
db.showtime_seat= Showtime_seat
db.seat = Seat
db.booking=Booking
db.ticket=Ticket


const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => console.log("Connected to Mongodb"))
    .catch((error) => {
      console.log(error.message);
      process.exit();
    });
};

db.connect = connectDB;

module.exports = db;
