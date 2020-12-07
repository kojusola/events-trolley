const mongoose = require('mongoose');

const customerModel = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        min: 10,
        max: 255
    },
    role: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('customer', customerModel);