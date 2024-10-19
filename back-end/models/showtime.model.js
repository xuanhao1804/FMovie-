const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShowtimeSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    startAt: {
        date: {
            type: Date
        },
        times: [
            { type: String }
        ]
    }
}, { timestamps: true });

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;
