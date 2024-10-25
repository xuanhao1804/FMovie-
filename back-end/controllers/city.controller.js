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
                message: "Không có dữ liệu"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const createNewCity = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            status: 400,
            message: "City name is required",
        });
    }

    try {
        const existingCity = await City.findOne({ name: name });
        if (existingCity) {
            return res.status(409).json({
                status: 409,
                message: "City already exists",
            });
        }

        const newCity = new City({ name });
        await newCity.save();

        return res.status(201).json({
            status: 201,
            message: "City created successfully",
            data: newCity,
        });
    } catch (error) {
        console.error("Error creating city:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};


const CityController = { getAllCity, createNewCity };
module.exports = CityController;