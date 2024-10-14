const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShowtimeSeatSchema = new Schema({
    Row: {
        type: String,
        required: true, 
    },
    column: {
        type: Number,
        required: true, 
    },
    available:{
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const ShowtimeSeat = mongoose.model('Showtime_seat', ShowtimeSeatSchema);

module.exports = ShowtimeSeat;
