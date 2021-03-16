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
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    role: {
        type: String,
        required: true,
    },
    refreshJWT:{
        type:Object,
        token:{
            type:String,
            max:500,
            required:true,
            default:""
        },
        addedAt:{
            type:Date,
            required:true,
            default: Date.now()
        }
    }
});
module.exports = mongoose.model('vendor', vendorModel);