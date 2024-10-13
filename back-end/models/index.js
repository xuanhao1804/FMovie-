const mongoose = require("mongoose");
const Movie = require("./Movie");

mongoose.Promise = global.Promise;

const db = {};

// db.user = User
db.movie = Movie

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
