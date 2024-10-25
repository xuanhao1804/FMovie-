const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    showtimes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Showtime',
        }
    ],
    seats: [
        {
            row: {
                type: String
            },
            column: {
                type: Number,
                required: true,
            },
            isVip: {
                type: Boolean
            }
        }
    ],

}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
