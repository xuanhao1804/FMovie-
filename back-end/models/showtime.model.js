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
        ref: 'cinema',
        required: true, // Thêm rạp chiếu phim để dễ dàng truy vấn theo rạp
    },
    startAt: {
        date: {
            type: Date,
            required: true,
        },
        times: [
            { type: String, required: true }
        ]
    }
}, { timestamps: true });

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;
