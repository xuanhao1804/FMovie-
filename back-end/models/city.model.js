const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Mỗi thành phố có tên duy nhất
    },
    // cinemas: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Cinema',  // Liên kết đến bảng Cinema
    //     }
    // ]
}, { timestamps: true });

const City = mongoose.model('city', CitySchema);

module.exports = City;
