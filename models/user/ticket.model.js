const mongoose = require('mongoose');

const ticketModel = mongoose.Schema({
    vendor_id : String,
    eventName:{
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    eventVenue:{
        type:String,
        required:true,
        min: 3,
    },
    startDate:{
        type: Date
    },
    endDate:{
        type:Date
    },
    categories:[{
        ticketName: String,
        Description: String,
        numberOfTickets: Number,
        price:String
    }],
    verified:{
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('ticket', ticketModel);