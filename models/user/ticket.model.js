const mongoose = require('mongoose');

const ticketModel = mongoose.Schema({
    vendorId : String,
    ticketImage :{
        type: Object,
        "avatar":{
            type:String
        },
        "cloundinaryId":{
            type:String
        }
    },
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
    venueAddress: {
        type:String,
        required:true
    },
    eventStartDate: {
        type: Date
    },
    eventEndDate: {
        type: Date
    },
    ticketSaleStartDate: {
        type: Date
    },
    ticketSaleEndDate: {
        type: Date
    },
    category:String,
    categories:[{
        ticketName: String,
        description: String,
        numberOfTickets: Number,
        price:String
    }],
    verified:{
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('ticket', ticketModel);