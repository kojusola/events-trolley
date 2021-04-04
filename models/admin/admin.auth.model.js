const mongoose = require('mongoose');
const { string } = require('@hapi/joi');

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
    },
    role:{
        type: String,
        type: String,
        required: true,
        min: 3,
        max: 255
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
},{timestamps: true})

module.exports = mongoose.model('adminUser', adminUserSchema);