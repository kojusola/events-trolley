require('dotenv').config();
const {getHeader,validateOtp,getBankCodes,payOut} = require('../../../helper/monnify.helper');
const transactionModel = require('../../../models/user/transactions.model');
const accountModel = require('../../../models/user/account.model');
const {debitAccount} = require('../../../helper/transactions');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { get } = require('mongoose');

exports.vendorPayOut = async function (req, res) {
    const _id = req.userId
    const role = req.userRole
    try{
        const account = await accountModel.findOne({userId:_id});
        if(account.balance>0 && account.balance>=req.body.amount && req.body.amount !== 0){
            const header = await getHeader();
            const bankCode = await getBankCodes(header.responseBody.accessToken, req.body.bankName);
            const getPayOut = await payOut({header:header,amount: req.body.amount,
                 destinationAccountNumber: req.body.accountNumber,transactionReference: v4(),
                  bankCode: bankCode}); 
            if(!getPayOut.requestSuccessful){
               return res.status(500).send({
                    status: false,
                    msg: 'Server Error',
                    data: null,
                    statusCode: 500
                });
            }
        }else{
            return res.status(400).send({
                status: false,
                msg: 'Insufficient funds',
                data: null,
                statusCode: 400
            });
        }
       return  res.status(200).send({
            status: true,
            msg: 'Payment Pending Authorization',
            data: {
                "reference": getPayOut.responseBody.reference
            },
            statusCode: 200
        });


    }catch(error){
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}   

exports.otpValidation = async(req, res) => {
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
