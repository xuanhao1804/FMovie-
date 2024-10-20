const db = require("../models");

const getShowtimebyDateandMoviesandCinema = async (req, res) => {
    try {
        let { cityId, movieId, date } = req.body;

        // Nếu 'date' là null, sử dụng ngày hôm nay
        if (!date) {
            date = new Date();  // Lấy ngày hôm nay
        } else {
            date = new Date(date);  // Nếu có 'date' thì chuyển về dạng Date
        }

        // Đặt thời gian về 0:00 để chỉ lấy phần ngày
        const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(startOfDay.getDate() + 1); // Ngày kết thúc là đầu ngày hôm sau

        // Lấy giờ hiện tại
        const currentTime = new Date();
        const currentHours = currentTime.getHours(); // Giờ hiện tại (theo múi giờ địa phương)
        const currentMinutes = currentTime.getMinutes(); // Phút hiện tại (theo múi giờ địa phương)

        // Chuyển đổi giờ hiện tại thành chuỗi HH:mm
        const currentHourString = `${currentHours}:${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes}`;

        const cinemas = await db.cinema.find({ city: cityId })
            .populate({
                path: 'rooms',
                populate: {
                    path: 'showtimes',
                    match: {
                        movie: movieId,
                        'startAt.date': {
                            $gte: startOfDay,  // Lấy từ đầu ngày
                            $lt: endOfDay      // Đến trước ngày hôm sau
                        },
                    }
                }
            })
            .exec();
        cinemas.forEach(cinema => {
            cinema.rooms.forEach(room => {
                room.showtimes.forEach(showtime => {
                    // Lọc các times
                    showtime.startAt.times = showtime.startAt.times.filter(time => time > currentHourString);
                });
            });
        });

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