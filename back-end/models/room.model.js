const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    seats: [{
        type: Schema.Types.ObjectId,
        ref: 'seat',
        required: true,
    }],
    
}, { timestamps: true });

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
