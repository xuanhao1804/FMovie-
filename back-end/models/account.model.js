const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: String
    }],
    fullname: {
        type: String,
        required: true,
    },
    dob: {
        type: Date
    },
    phone: {
        type: String
    },

}, { timestamps: true });

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
