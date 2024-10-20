const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    director: {
        type: String,
    },
    actors: [
        { type: String }
    ],
    studio: {
        type: String
    },
    price: {
        type: Number
    },
    duration: {
        type: Number
    },
    country: {
        type: String
    },
    genres: [
        { type: String }
    ],
    limit: {
        type: String
    },
    rating: {
        type: Number
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    }
}, { timestamps: true });

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
