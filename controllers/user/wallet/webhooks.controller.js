require('dotenv').config();
const {getHeader,validateOtp,getBankCodes,payOut} = require('../../../helper/monnify.helper');
const transactionModel = require('../../../models/user/transactions.model');
const accountModel = require('../../../models/user/account.model');
const {creditAccount} = require('../../../helper/transactions');
const mongoose = require('mongoose');




exports.paymentValidation = async(req, res) => {
    const _id = req.userId
    const role = req.userRole
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const opts = {session,new:true};
        const validation = validateOtp({reference:req.body.reference,authorizationCode:req.body.otp});
        if(!validation.requestSuccessful){
            return res.status(500).send({
                 status: false,
                 msg: 'validation Error',
                 data: null,
                 statusCode: 500
             });
         }
        const accountDebited = debitAccount ({
            amount:validation.responseBody.amount,userId:req.userId, purpose: "vendor Payout", 
            reference:validation.responseBody.reference, opts
          })
          await session.commitTransaction();
             session.endSession();
       return  res.status(200).send({
            status: true,
            msg: 'Payment Pending Authorization',
            data: {
                "reference": getPayOut.responseBody.reference
            },
            statusCode: 200
        });


    }catch(error){
        await session.abortTransaction();
        session.endSession()
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}