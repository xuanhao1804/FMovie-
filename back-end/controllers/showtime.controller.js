const db = require("../models");

const getShowtimebyDateandMoviesandCinema = async (req, res) => {
    try {
        let { cityId, movieId } = req.body;
        const cinemas = await db.cinema.find({ city: cityId })
            .populate({
                path: 'rooms',
                select: '-seats',
                populate: {
                    path: 'showtimes',
                    match: {
                        movie: movieId,
                    }
                }
            })
            .select('-movies')
            .exec();
        const filteredCinemas = cinemas.filter(cinema =>
            cinema.rooms.some(room => room.showtimes.length > 0))
        return res.status(200).json({ filteredCinemas });

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
const ShowtimeController = { getShowtimebyDateandMoviesandCinema, getAllShowtime };

module.exports = ShowtimeController;