const mongoose = require('mongoose');

const accountModel = mongoose.Schema({
    userId : String,
    balance: {
        type: Number,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model('account', accountModel);