const mongoose = require('mongoose');

const ticketModel = mongoose.Schema({
    vendor_id : String,
    event_name:{
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
        ticketname: String,
        Description: String,
        numoftickets: Number,
        price:Number
    }],
    verified:{
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('ticket', ticketModel);