//create OTP model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    timeCreated: {
        type: Date,
        default: Date.now,
        expires: 300 // tự động xóa sau 5 phút (300 giây)
    }
}, { timestamps: true });

const OTP = mongoose.model('OTP', OTPSchema);

module.exports = OTP;