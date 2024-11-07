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

const creatNewRoom = async (req, res) => {
    try {
        if (req.body) {
            const newRoom = await db.room.create({
                name: req.body.roomName,
                showtimes: [],
                areas: req.body.areas
            })
            if (newRoom) {
                const cinema = await db.cinema.findOne({
                    _id: req.body.cinemaId
                })
                cinema.rooms.push(newRoom._id)
                await cinema.save()
                return res.status(201).json({
                    message: "Thêm mới thành công",
                    room: newRoom
                });
            } else {
                return res.status(500).json({
                    message: "Có lỗi xảy ra, vui lòng thử lại"
                });
            }
        } else {
            return res.status(422).json({
                message: "Thiếu dữ liệu"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const editRoom = async (req, res) => {
    try {
        if (req.body) {
            const updatedRoom = await db.room.findOneAndUpdate(
                { _id: req.body.id },
                {
                    name: req.body.name,
                    areas: req.body.areas
                },
                { new: true } // Return the updated document
            );
            return res.status(201).json({
                message: "Cập nhật thành công",
                room: updatedRoom
            });
        } else {
            return res.status(422).json({
                message: "Thiếu dữ liệu"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const RoomController = {
    getRoomByID,
    creatNewRoom,
    editRoom
};
module.exports = RoomController;