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

const PopcornController = {
    getAllPopcorn
};
module.exports = PopcornController;