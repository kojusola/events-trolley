const mongoose = require('mongoose');

const categoryModel = mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    Price:{
        type:Number
    }
});
module.exports = mongoose.model('category', categoryModel);