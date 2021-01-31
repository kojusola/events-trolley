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
        min: 6,
        max: 255,
        select: false
    },
    businessName: {
        type: String,
        required: true,
    },
    businessNumber: {
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
    },
    ticket:[],
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