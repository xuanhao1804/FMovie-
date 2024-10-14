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
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "role" }],
    fullname: {
        type: String,
        required: true,
    },
    gender: {
        type: Boolean
    },
    dob: {
        type: Date
    }

}, { timestamps: true });

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
