const { get } = require("lodash");
const db = require("../models");
const Cinema = db.cinema;
const City = db.city;
const mongoose = require("mongoose");

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
        const response = await Cinema.find({ city: cityId })
            // .populate('city', 'name') // Lấy tên thành phố khi liên kết
            // .exec();
        
        if (response) {
            return res.status(200).json({
                status: 200,
                data: response,
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



const CinemaController = {getAllCinema, getCinemaByCity};
module.exports = CinemaController;