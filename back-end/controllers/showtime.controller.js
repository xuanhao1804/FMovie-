const db = require("../models");

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

const ShowtimeController = { getShowtimebyDateandMoviesandCinema };


module.exports = ShowtimeController;