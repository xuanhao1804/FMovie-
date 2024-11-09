const { get } = require("lodash");
const db = require("../models");
const Cinema = db.cinema;
const City = db.city;
const mongoose = require("mongoose");
const Showtime = db.showtime;
const Room = db.room;

const getAllCinema = async (req, res) => {
    try {
        const response = await db.cinema.find({
        })
        if (response) {
            return res.status(200).json({
                status: 200,
                data: response
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy phim"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getCinemaByCity = async (req, res) => {
    const cityId = req.params.id; // lấy id của city từ params
    try {
        // Tìm tất cả các rạp thuộc thành phố với cityId
        const response = await db.cinema.where({ city: cityId })
            .populate('city', 'name') // Lấy tên thành phố khi liên kết
            .exec();
        if (response) {

            return res.status(200).json({
                status: 200,
                data: response.map(cinema => {
                    return cinema.movies
                }),
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy rạp nào cho thành phố này',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi hệ thống Back-end',
        });
    }
};

const getMoviesByCinema = async (req, res) => {
    const { cinemaId } = req.params;  // Get the cinemaId from the request parameters

    try {
        // Find the cinema by its ID and populate the 'movies' field
        const cinema = await Cinema.findById(cinemaId).populate('movies');

        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found" });
        }

        // Return the movies from the cinema
        return res.status(200).json({
            status: 200,
            data: cinema.movies
        });
    } catch (error) {
        console.error("Error fetching movies by cinema:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getShowtimesByCinema = async (req, res) => {
    const { cinemaId, date } = req.query;  // Lấy cinemaId và date từ query parameters

    try {
        // Lấy danh sách suất chiếu theo rạp và ngày
        const showtimes = await Showtime.find({
            cinema: cinemaId,
            'startAt.date': {
                $gte: new Date(`${date}T00:00:00.000Z`),  // Tìm suất chiếu từ 00:00 ngày đó
                $lt: new Date(`${date}T23:59:59.999Z`)    // Đến 23:59:59 ngày đó
            }
        }).populate('movie cinema'); // Liên kết thông tin phim và rạp

        if (!showtimes.length) {
            return res.status(404).json({ message: 'Không tìm thấy suất chiếu nào' });
        }

        return res.status(200).json({
            status: 200,
            data: showtimes
        });
    } catch (error) {
        console.error('Error fetching showtimes by cinema:', error);
        return res.status(500).json({ message: 'Lỗi hệ thống Backend' });
    }
};

const getRoomByCinema = async (req, res) => {
    try {
        // Lấy danh sách suất chiếu theo rạp và ngày
        const rooms = await db.cinema.findOne({
            _id: req.body.cinemaId,
        }).select("rooms")
            .populate({
                path: "rooms",
                select: "name areas"
            })

        return res.status(200).json({
            status: 200,
            data: rooms
        });
    } catch (error) {
        console.error('Error fetching showtimes by cinema:', error);
        return res.status(500).json({ message: 'Lỗi hệ thống Backend' });
    }
};

const CreateNewCinema = async (req, res) => {
    const { name, city, address } = req.body;
    try {
        const newCinema = new db.cinema({
            name,
            city,
            address
        });
        const savedCinema = await newCinema.save();
        return res.status(201).json(savedCinema);
    } catch (error) {
        console.error('Error creating new cinema:', error);
        return res.status(500).json({ message: 'Error creating new cinema', error });
    }
};
const EditCinema = async (req, res) => {
    const { id } = req.params;
    const { name, city, address } = req.body;
    try {
        const updatedCinema = await Cinema.findByIdAndUpdate(
            id,
            { name, city, address },
            { new: true }
        );
        return res.status(200).json(updatedCinema);
    } catch (error) {
        console.error('Error creating new cinema:', error);
        return res.status(500).json({ message: 'Error creating new cinema', error });
    }
};

const getMoviesAndShowtimesByCinema = async (req, res) => {
    const { cinemaId } = req.params;  // Lấy cinemaId từ params
    try {
        // Tìm rạp chiếu phim theo ID và populate các phòng chiếu
        const cinema = await Cinema.findById(cinemaId).populate('rooms');

        if (!cinema) {
            return res.status(404).json({ message: "Không tìm thấy rạp" });
        }

        let allShowtimes = [];
        let allMovies = [];

        // Duyệt qua từng phòng chiếu của rạp
        for (const room of cinema.rooms) {
            // Lấy tất cả suất chiếu của từng phòng (populate showtimes)
            const populatedRoom = await Room.findById(room._id).populate({
                path: 'showtimes',   // Populate suất chiếu
                populate: { path: 'movie' }  // Populate movie trong showtimes
            });
            if (populatedRoom.showtimes.length > 0) {
                allShowtimes.push(...populatedRoom.showtimes); // Lưu tất cả suất chiếu vào mảng
            }

            // Duyệt qua các suất chiếu để lấy phim tương ứng
            for (const showtime of populatedRoom.showtimes) {
                const movie = showtime.movie;
                if (movie && !allMovies.some(m => m._id.equals(movie._id))) {
                    allMovies.push(movie); // Lưu phim vào mảng nếu chưa có
                }
            }
        }
        // Trả về dữ liệu gồm danh sách các phim và các suất chiếu
        return res.status(200).json({
            status: 200,
            data: {
                cinema: cinema.name,
                movies: allMovies, // Danh sách các phim của rạp
                showtimes: allShowtimes // Danh sách tất cả các suất chiếu
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy phim và suất chiếu:", error);
        return res.status(500).json({ message: "Lỗi hệ thống Backend" });
    }
};




const CinemaController = {
    getAllCinema, getCinemaByCity, getMoviesByCinema, getShowtimesByCinema, CreateNewCinema,
    EditCinema, getMoviesAndShowtimesByCinema,
    getRoomByCinema
};
module.exports = CinemaController;