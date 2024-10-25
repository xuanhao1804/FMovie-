const db = require("../models");

const getRoomByID = async (req, res) => {
    try {
        const room = await db.room.findOne({
            _id: req.body.roomID
        }).select("areas")
        if (room) {
            return res.status(200).json({
                status: 200,
                data: room
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: "Phòng không tồn tại"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

const CreatnewRoomforCinema = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const RoomController = {
    getRoomByID,
    CreatnewRoomforCinema
};
module.exports = RoomController;