const mongoose = require('mongoose');

const adminUserSchema = mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        min: 3,
        max: 255
    }
}, { timestamps: true })

module.exports = mongoose.model('adminUser', adminUserSchema);