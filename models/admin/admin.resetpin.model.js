const mongoose = require('mongoose');
const { string } = require('@hapi/joi');

resetPinSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    resetpin: {
        type: String,
        required: true,
        min: 6,
        max: 6
    }
},{timestamps: true})

module.exports = mongoose.model('resetpin', resetPinSchema);