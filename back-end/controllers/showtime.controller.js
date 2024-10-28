const db = require("../models");
const { findById } = require("../models/movie.model");

const getShowtimebyDateandMoviesandCinema = async (req, res) => {
    try {
        let { cityId, movieId } = req.body;
        const currentDate = new Date()
        const dateLimit = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
        let cinemas;
        if (cityId) {
            cinemas = await db.cinema.find({ city: cityId })
                .populate({
                    path: 'rooms',
                    select: '-areas',
                    populate: {
                        path: 'showtimes',
                        match: {
                            movie: movieId,
                            "startAt.date": { $gt: dateLimit }
                        }
                    }
                })
                .select('-movies')
                .exec();
        } else {
            cinemas = await db.cinema.find()
                .populate({
                    path: 'rooms',
                    select: '-seats',
                    populate: {
                        path: 'showtimes',
                        match: {
                            movie: movieId,
                            "startAt.date": { $gt: dateLimit }
                        }
                    }
                })
                .select('-movies')
                .exec();
        }

        const filteredCinemas = cinemas.filter(cinema =>
            cinema.rooms.some(room => room.showtimes.length > 0))
        return res.status(200).json({
            status: 200,
            data: filteredCinemas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getAllShowtime = async (req, res) => {
    try {
        const showtimes = await db.showtime.find().exec();
        return res.status(200).json({ showtimes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getShowtimebyCinemaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const showtime = await db.cinema.findById(id)
            .populate({
                path: 'rooms',
                select: '-areas',
                populate: {
                    path: 'showtimes',
                }
            })
            .select('-movies')
            .exec();
        return res.status(200).json({ showtime })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const CreateNewShowtime = async (req, res) => {
    const { movieId, date, time, long, roomId } = req.body;
    try {
        const durationMovies = await db.movie.findById(movieId);
        const startOfDay = new Date(`${date}T00:00:00Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const existingRoom = await db.room.findById(roomId)
            .populate({
                path: 'showtimes',
                match: {
                    'startAt.date': {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                }
            })
            .exec();

        const existingShowtimes = existingRoom.showtimes || [];

        const newShowtimeTime = new Date(`${date}T${time}:00Z`).getTime();

        // Check for overlapping showtimes
        for (const showtime of existingShowtimes) {
            const existingShowtimeStart = new Date(`${date}T${showtime.startAt.time}:00Z`).getTime();
            const existingShowtimeEnd = existingShowtimeStart + durationMovies.duration * 60000;
            const newShowtimeEnd = newShowtimeTime + long * 60000;
            // Check for overlap
            if (
                (newShowtimeTime < existingShowtimeEnd && newShowtimeTime >= existingShowtimeStart) || // New starts during existing
                (newShowtimeEnd > existingShowtimeStart && newShowtimeEnd <= existingShowtimeEnd) || // New ends during existing
                (newShowtimeTime <= existingShowtimeStart && newShowtimeEnd >= existingShowtimeEnd) // New encompasses existing
            ) {
                return res.status(400).json({
                    message: 'Bị trùng lặp thời gian chiếu phim.',
                });
            }
        }
        const newShowtime = new db.showtime({
            movie: movieId,
            startAt: { date, time },
            room: roomId,
        });
        const savedShowtime = await newShowtime.save();
        await db.room.findByIdAndUpdate(roomId, { $push: { showtimes: savedShowtime._id } }, { new: true });
        return res.status(201).json({
            message: 'Showtime created successfully',
            showtime: existingRoom.showtimes,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

const ShowtimeController = { getShowtimebyDateandMoviesandCinema, getAllShowtime, getShowtimebyCinemaAdmin, CreateNewShowtime };


module.exports = ShowtimeController;