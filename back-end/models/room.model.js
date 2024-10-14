const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    seats: [{
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
    }],
    
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
