const { body } = require('express-validator');
const mongoose = require('mongoose');

const PopcornSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    status: {
        type: String
    }
}, { timestamps: true });

const Popcorn = mongoose.model("Popcorn", PopcornSchema);

module.exports = Popcorn;
