const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CinemaSchema = new Schema({
    name: {
        type: String,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
    },
    // rooms: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Room'
    //     }
    // ],
    address: {
        type: String,
    },
    // movies: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Movie'
    //     }
    // ]
}, { timestamps: true });

const Cinema = mongoose.model('cinema', CinemaSchema);

module.exports = Cinema;
