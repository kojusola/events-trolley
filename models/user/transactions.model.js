const mongoose = require('mongoose');
const { required } = require('@hapi/joi');

const transactionModel = mongoose.Schema({
    userId : String,
    transactionType: {
        type: String,
        required: true,
        enum:['debit', 'credit']
      },
      purpose: {
        type: String,
        required: true,
        enum:['deposit', 'transfer', 'reversal', 'withdraw']
      },
      amount: {
        type: Number,
        required: true
      },
      accountId:String,
      reference: {
        type: String,
        required:true
      },
      balanceBefore: {
        type: Number,
        required: true
      },
      balanceAfter: {
        type: Number,
        required: true
      },
      metadata: {
        type: String,
        required: true
      }
},{timestamps: true});

module.exports = mongoose.model('transaction', transactionModel);