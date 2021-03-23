const mongoose = require('mongoose');

const ticketBoughtModel = mongoose.Schema({
    vendorId : String,
    customerId: String,
    ticketId: String,
    ticketUserName: {
        type: String,
        min: 3,
        max: 255
    },
    ticketType: {
        type: String,
        min: 3,
        max: 255
    },
    eventName:{
        type: String,
        min: 3,
        max: 255
    },
    eventVenue:{
        type:String,
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
    eventTime: {
        type: String
    },
    checkIn:{
        type: Boolean,
        default: false
    }
},{timestamps: true})
module.exports = mongoose.model('ticketBought', ticketBoughtModel);