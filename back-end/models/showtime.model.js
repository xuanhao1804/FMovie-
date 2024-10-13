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
    screen: {  // Thêm liên kết đến phòng chiếu
        type: Schema.Types.ObjectId,
        ref: 'Screen',
        required: true,
    },
    Screening_time: {
        type: Date,
        required: true,  // Bao gồm ngày và giờ chiếu phim
    }
}, { timestamps: true });

const Showtime = mongoose.model('showtime', ShowtimeSchema);

module.exports = Showtime;
