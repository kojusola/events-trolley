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
        type:String
    },
    eventStartDate: {
        type: String
    },
    eventEndDate: {
        type: String
    },
    ticketSaleStartDate: {
        type: String
    },
    ticketSaleEndDate: {
        type: String
    },
    category:String,
    categories:[{
        ticketName: String,
        description: String,
        numberOfTickets: Number,
        price:{
            type: String,
            default: null
        }
    }],
    verified:{
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('ticket', ticketModel);