require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const {MovieRouter,CinemaRouter,Roomrouter,ShowtimeRouter,CityRouter}   = require('./routes');
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const http = require("http");
//khoi tao web server




const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL,
    },
});

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "64mb" }));
app.use(bodyParser.urlencoded({ limit: "64mb", extended: true }));

// Above our `app.get("/users")` handler
app.use("/movie", MovieRouter);
app.use("/cinema", CinemaRouter);
app.use("/room", Roomrouter);
app.use("/showtime", ShowtimeRouter);
app.use("/city", CityRouter);

io.on("connection", (socket) => {
    console.log("An user connect: ", socket.id);

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

exports.io = io;

server.listen(process.env.PORT || 9999, process.env.HOST_NAME || "localhost", () => {
    console.log(`Server in running at: http://${process.env.HOST_NAME}:${process.env.PORT}`);
    db.connect();
});
