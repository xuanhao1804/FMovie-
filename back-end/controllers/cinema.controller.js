const { get } = require("lodash");
const db = require("../models");
const Cinema = db.cinema;
const City = db.city;
const mongoose = require("mongoose");
const Showtime = db.showtime;

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
<<<<<<< HEAD
    console.log('123', cityId);
=======
>>>>>>> 29d0ce4573609c235aa193fe714ae00a4c4699ba
    try {
        // Tìm tất cả các rạp thuộc thành phố với cityId
        const response = await db.cinema.where({ city: cityId })
            .populate('city', 'name') // Lấy tên thành phố khi liên kết
            .exec();
<<<<<<< HEAD
        console.log('respon', response);
=======
>>>>>>> 29d0ce4573609c235aa193fe714ae00a4c4699ba
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
const CreateNewCinema = async (req, res) => {
    const { name, city, address } = req.body;
    try {
        const newCinema = new db.cinema({
            name,
            city,
            address
        });
<<<<<<< HEAD

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

=======
        const savedCinema = await db.cinema.save();
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

>>>>>>> 29d0ce4573609c235aa193fe714ae00a4c4699ba
const CinemaController = {
    getAllCinema, getCinemaByCity, getMoviesByCinema, getShowtimesByCinema, CreateNewCinema,
    EditCinema
};
module.exports = CinemaController;