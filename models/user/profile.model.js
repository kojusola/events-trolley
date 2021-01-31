const mongoose = require('mongoose');

const profileModel = mongoose.Schema({
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
    }
});

module.exports = mongoose.model('vendor', profileModel);