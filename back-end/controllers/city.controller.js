const db = require("../models");
const City = db.city;

const getAllCity = async (req, res) => {
    try {
        const response = await City.find({
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


const CityController = {getAllCity};
module.exports = CityController;