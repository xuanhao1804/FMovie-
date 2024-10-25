const db = require("../models");

const getAllMovie = async (req, res) => {
    try {
        const response = await db.movie.find({
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

const getMovieByID = async (req, res) => {
    try {
        const response = await db.movie.findOne({
            _id: req.params.id
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
const CreatnewMovie = async (req, res) => {
    try {
        const file = req.file;
        const { name, actors, director, duration, genres, video, studio, country, description, status, price } = req.body;
        console.log(file.path)
        // Tạo một đối tượng movie mới
        const newMovie = new db.movie({
            name,
            director,
            actors,
            studio,
            duration,
            country,
            genres,
            image: file.path,
            video,
            description,
            publicId: file.filename,
            price,
            status
        });
        const savedMovie = await newMovie.save();
        res.status(201).json({
            success: true,
            data: savedMovie,
            message: 'Movie created successfully!',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const Editmovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, director, actors, studio, price, duration, country, genres, limit, video, description, status } = req.body;
        const updatedMovie = await db.movie.findByIdAndUpdate(id, {
            name,
            director,
            actors,
            studio,
            price,
            duration,
            country,
            genres,
            limit,
            video,
            description,
            status
        }, { new: true }); // Option to return the updated document

        return res.status(200).json(updatedMovie); // Return the updated movie
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const Deletemovie = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await db.movie.findByIdAndDelete(id);


        if (!deletedMovie) {
            return res.status(404).json({ message: "Phim không tồn tại" });
        }

        return res.status(200).json({ message: "Phim đã được xóa thành công" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};


module.exports = {
    getAllMovie,
    getMovieByID,
    CreatnewMovie,
    Editmovie,
    Deletemovie
};
