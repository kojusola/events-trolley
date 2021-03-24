const mongoose = require('mongoose');

const profileModel = mongoose.Schema({
    userId : String,
    fullname: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    vendorPayoutPercentage:{
        type:Number,
        Default:100
    },
    businessName: {
        type: String
    },
    businessNumber: {
        type: String
    },
    location: {
        type: String
    },
    socials: {
        type: Object
    },
    serviceType: {
        type: String
    },
    ticket:[]
},{timestamps: true});

module.exports = mongoose.model('profile', profileModel);