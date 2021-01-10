const mongoose = require('mongoose');
const { string } = require('@hapi/joi');

resetPinSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    id: {
        type: String,
        required: true,
    },
    role:{
        type:String
    }
},{timestamps: true})

module.exports = mongoose.model('resetpin', resetPinSchema);