const mongoose = require('mongoose');

const accountModel = mongoose.Schema({
    userId : String,
    balance: {
        type: Number
    },
    accountName: String,
    accountNumber: String,
    referenceNumber: String,
    accountBvn: String,
    bank: String,
    reservationReference: String
},{timestamps: true});

module.exports = mongoose.model('account', accountModel);