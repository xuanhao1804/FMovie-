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

const getShowtimeByCinema = async (req, res) => {
    try {
        let { cinemaId } = req.params;
        const currentDate = new Date()
        const dateLimit = new Date(currentDate.getTime() + 1 * 60 * 60 * 1000);
        let cinemas = await db.cinema.findOne({ _id: cinemaId })
            .populate({
                path: 'rooms',
                select: '-areas',
                populate: {
                    path: 'showtimes',
                    match: {
                        "startAt.date": { $gt: dateLimit }
                    }
                }
            })
            .select('-movies')
            .exec();
        cinemas.rooms = cinemas.rooms.filter(room => room.showtimes.length > 0)
        return res.status(200).json({
            status: 200,
            data: cinemas
        });
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
const CreateMultipleShowtimes = async (req, res) => {
    const { roomId, items } = req.body;

    try {
        const newShowtimes = [];

        // Lặp qua tất cả các phần tử trong items
        for (const item of items) {
            const { date, subitems } = item;

            // Kiểm tra xem date có hợp lệ không
            const startDate = new Date(date);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ message: `Ngày không hợp lệ: ${date}` });
            }

            // Lấy phòng chiếu và các suất chiếu hiện tại trong ngày của phòng đó
            const startOfDay = new Date(startDate.setHours(0, 0, 0, 0)); // Chuyển thời gian về đầu ngày
            const endOfDay = new Date(startDate.setHours(23, 59, 59, 999)); // Chuyển thời gian về cuối ngày

            const existingRoom = await db.room.findById(roomId)
                .populate({
                    path: 'showtimes',
                    match: {
                        'startAt.date': {
                            $gte: startOfDay,
                            $lte: endOfDay,
                        }
                    }
                })
                .exec();

            if (!existingRoom) {
                return res.status(400).json({ message: 'Phòng chiếu không tồn tại' });
            }

            const existingShowtimes = existingRoom.showtimes || [];

            // Kiểm tra sự trùng lặp giữa các suất chiếu trong cùng một "item"
            for (let i = 0; i < subitems.length; i++) {
                const { movieId, time } = subitems[i];
                const durationMovies = await db.movie.findById(movieId).select('duration').exec();

                // Chuyển thời gian chiếu mới thành dạng timestamp
                const newShowtimeTime = new Date(`${date.split('T')[0]}T${time}:00Z`).getTime();
                const newShowtimeEnd = newShowtimeTime + (+durationMovies.duration) * 60000;

                // Kiểm tra trùng lặp giữa các suất chiếu trong cùng ngày
                for (let j = i + 1; j < subitems.length; j++) {
                    const { time: timeToCompare } = subitems[j];
                    const compareTime = new Date(`${date.split('T')[0]}T${timeToCompare}:00Z`).getTime();
                    const compareEndTime = compareTime + (+durationMovies.duration) * 60000;

                    // Nếu thời gian của 2 suất chiếu có sự trùng lặp
                    if (
                        (newShowtimeTime < compareEndTime && newShowtimeTime >= compareTime) ||
                        (newShowtimeEnd > compareTime && newShowtimeEnd <= compareEndTime) ||
                        (newShowtimeTime <= compareTime && newShowtimeEnd >= compareEndTime)
                    ) {
                        return res.status(400).json({
                            message: `Trùng lặp thời gian chiếu phim tại ${time} và ${timeToCompare}.`,
                        });
                    }
                }

                // Kiểm tra sự trùng lặp với các suất chiếu hiện tại trong database
                let isOverlapping = false;
                for (const showtime of existingShowtimes) {
                    const existingShowtimeStart = new Date(`${date.split('T')[0]}T${showtime.startAt.time}:00Z`).getTime();
                    const existingShowtimeEnd = existingShowtimeStart + durationMovies.duration * 60000;

                    // Kiểm tra các điều kiện trùng lặp
                    if (
                        (newShowtimeTime < existingShowtimeEnd && newShowtimeTime >= existingShowtimeStart) ||
                        (newShowtimeEnd > existingShowtimeStart && newShowtimeEnd <= existingShowtimeEnd) ||
                        (newShowtimeTime <= existingShowtimeStart && newShowtimeEnd >= existingShowtimeEnd)
                    ) {
                        isOverlapping = true;
                        break;
                    }
                }

                if (isOverlapping) {
                    const movie = await db.movie.findById(movieId).select('name');
                    return res.status(400).json({
                        message: `Bị trùng lặp thời gian chiếu phim ${movie.name} vào lúc ${time}.`,
                    });
                }

                // 5. Nếu không có trùng lặp, tạo mới Showtime
                const newShowtime = new db.showtime({
                    movie: movieId,
                    startAt: {
                        date: startDate,  // Chuyển `date` thành đối tượng Date hợp lệ
                        time,
                    },
                    room: roomId,
                });

                // Lưu Showtime vào DB
                const savedShowtime = await newShowtime.save();
                newShowtimes.push(savedShowtime);

                // Cập nhật thông tin showtimes của phòng
                await db.room.findByIdAndUpdate(roomId, { $push: { showtimes: savedShowtime._id } }, { new: true });
            }
        }

        // 6. Trả về thông báo thành công và thông tin các suất chiếu đã tạo
        return res.status(201).json({
            message: 'Các suất chiếu mới đã được tạo thành công.',
            showtimes: newShowtimes,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};







const ShowtimeController = {
    getShowtimebyDateandMoviesandCinema,
    getAllShowtime,
    getShowtimebyCinemaAdmin,
    CreateNewShowtime,
    getShowtimeByCinema,
    CreateMultipleShowtimes
};

module.exports = ShowtimeController;