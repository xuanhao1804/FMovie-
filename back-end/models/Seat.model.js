const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
    row: {
        type: String,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    column: {
        type: Number,
        required: true,  // Ví dụ: "Phòng chiếu 1"
    },
    
}, { timestamps: true });

const Seat = mongoose.model('Seat', SeatSchema);

module.exports = Seat;
