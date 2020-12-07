const mongoose = require('mongoose');

const vendorModel = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        min: 10,
        max: 255
    },
    buisnessName: {
        type: String,
        required: true,
    },
    buisnessNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    socials: {
        type: Object,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
})
module.exports = mongoose.model('vendor', vendorModel);