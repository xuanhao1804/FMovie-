const db = require("../models");

const getAllPopcorn = async (req, res) => {
    try {
        const combos = await db.popcorn.find({})
        if (combos) {
            return res.status(200).json({
                status: 200,
                data: combos
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "Không có dữ liệu"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};
const CreateNewPopCorn = async (req, res) => {
    const file = req.file;
    const { name, description, price } = req.body;
    try {
        const newPopcorn = new db.popcorn({
            name,
            description,
            price,
            image: file.path
        });
        const savePopcorn = await newPopcorn.save();
        return res.status(201).json(savePopcorn);
    } catch (error) {
        console.error('Error creating new cinema:', error);
        return res.status(500).json({ message: 'Error creating new cinema', error });
    }
};
const EditPopCorn = async (req, res) => {
    const file = req.file;
    console.log(req.file);
    const { id } = req.body;
    const { name, description, price } = req.body;
    try {
        if (file?.path) {
            const updatedPopcorn = await db.popcorn.findByIdAndUpdate(
                id,
                {
                    name,
                    image: file.path,
                    description,
                    price,
                },
                { new: true }
            );
            return res.status(200).json(updatedPopcorn);
        }
        if (!file) {
            const updatedPopcorn = await db.popcorn.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    price,
                },
                { new: true }
            );
            return res.status(200).json(updatedPopcorn);
        }
    } catch (error) {
        console.error('Error creating new cinema:', error);
        return res.status(500).json({ message: 'Error creating new cinema', error });
    }
};
const DeletePopCorn = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMovie = await db.popcorn.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: "PopCorn không tồn tại" });
        }
        return res.status(200).json({ message: "PopCorn đã được xóa thành công" });
    } catch (error) {
        console.error('Error creating new cinema:', error);
        return res.status(500).json({ message: 'Error creating new cinema', error });
    }
};

const PopcornController = {
    getAllPopcorn, CreateNewPopCorn, EditPopCorn, DeletePopCorn
};
module.exports = PopcornController;