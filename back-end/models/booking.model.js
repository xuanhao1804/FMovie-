const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    booking_time: {
        type: Date
    },
    total_price: {
        type: Number,
    },
    status:{
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    tickets:{
        type: Schema.Types.ObjectId,
        ref:"Ticket"
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
