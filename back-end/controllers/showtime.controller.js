const db = require("../models");

const getShowtimebyDateandMoviesandCinema = async (req, res) => {
    try {
        let { cityId, movieId } = req.body;

        const cinemas = await db.cinema.find({ city: cityId })
            .populate({
                path: 'rooms',
                populate: {
                    path: 'showtimes',
                    match: {
                        movie: movieId,
                    }
                }
            })
            .exec();
        return res.status(200).json({ cinemas });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const ShowtimeController = { getShowtimebyDateandMoviesandCinema };
module.exports = ShowtimeController;