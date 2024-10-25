const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    showtimes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Showtime',
        }
    ],
    areas: [
        {
            name: {
                type: String
            },
            col: {
                type: Number,
            },
            seats: [
                {
                    position: {
                        type: Number,
                        isVip: Boolean
                    }
                }
            ]
        }
    ],

}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
