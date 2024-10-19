const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Mỗi thành phố có tên duy nhất
    },
}, { timestamps: true });

const City = mongoose.model('city', CitySchema);

module.exports = City;
