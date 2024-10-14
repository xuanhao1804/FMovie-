const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    showtime: {
        type: Schema.Types.ObjectId,
       ref:"Showtime"
    },
    seat: [{
        type: Schema.Types.ObjectId,
        ref: 'Showtime_seat',
    }],
    
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
