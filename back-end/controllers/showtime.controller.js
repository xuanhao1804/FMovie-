const db = require("../models");

const getShowtimebyDateandMoviesandCinema = async (req, res) => {
    try {
        const { cityId, movieId, date } = req.body;


        const cinemas = await db.cinema.find({ city: cityId })
            .populate({
                path: 'rooms',
                populate: {
                    path: 'showtimes',
                    match: {
                        movie: movieId,
                        // Thêm so sánh ngày giờ ở đây
                    }
                }
            })
            .exec();
        return res.status(200).json({ cinemas })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};



const ShowtimeController = { getShowtimebyDateandMoviesandCinema };
module.exports = ShowtimeController;