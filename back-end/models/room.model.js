const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    cinema: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
    },
    name: {
        type: String,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    seats: {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
    },
}, { timestamps: true });

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
