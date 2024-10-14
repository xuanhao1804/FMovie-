const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShowtimeSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    cinema: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
    },
    price: {
        type: Number
    },
    room: {  // Thêm liên kết đến phòng chiếu
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    showtime_seats: [{
        type: Schema.Types.ObjectId,
        ref: "Showtime_seat",
    }],
    Present_time: {
        type: Date,
        required: true,  // Bao gồm ngày và giờ chiếu phim
    }
}, { timestamps: true });

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;
