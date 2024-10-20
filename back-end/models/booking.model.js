const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    total_price: {
        type: Number,
    },
    status: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    showtime: {
        type: Schema.Types.ObjectId,
        ref: "Showtime"
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
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

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
