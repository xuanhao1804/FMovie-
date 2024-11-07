const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    total_price: {
        type: Number,
    },
    status: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    showtime: {
        type: Schema.Types.ObjectId,
        ref: "Showtime"
    },
    seats: [
        {
            area: {
                type: String
            },
            position: {
                type: Number
            },
            isVip: {
                type: Boolean
            }
        }
    ],
    popcorns: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Popcorn"
            },
            quantity: {
                type: Number
            }
        }
    ],
    orderCode: {
        type: Number
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    transaction: {
        accountNumber: String,
        amount: Number,
        description: String,
        reference: String,
        transactionDateTime: String,
        counterAccountBankId: String,
        counterAccountName: String,
        counterAccountNumber: String,
        currency: String,
        orderCode: Number,
        paymentLinkId: String,
        code: String,
        desc: String
    }

}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
