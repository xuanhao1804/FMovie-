const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CinemaSchema = new Schema({
    name: {
        type: String,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'city',
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    address: {
        type: String,
    },

}, { timestamps: true });

const Cinema = mongoose.model('cinema', CinemaSchema);

module.exports = Cinema;
