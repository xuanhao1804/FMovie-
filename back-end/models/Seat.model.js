const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
    row: {
        type: String,
        required: true,
    },
    column: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

const Seat = mongoose.model('Seat', SeatSchema);

module.exports = Seat;
