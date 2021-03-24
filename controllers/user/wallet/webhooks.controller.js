require('dotenv').config();
const {calculateHash,transactionStatus} = require('../../../helper/monnify.helper');
const transactionModel = require('../../../models/user/transactions.model');
const accountModel = require('../../../models/user/account.model');
const {creditAccount} = require('../../../helper/transactions');

const mongoose = require('mongoose');




exports.paymentValidation = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const vendorDetails =  await transactionModel.findOne({"reference":req.body.paymentReference});
        if(vendorDetails){
            res.status(400).send({
                status: false,
                msg: 'Transaction already exists',
                data: null,
                statusCode: 400
            });
        }
        const hash = await calculateHash({paymentReference:req.body.paymentReference,amountPaid:req.body.amountPaid,
            paidOn:req.body.paidOn,transactionReference: req.body.transactionReference});
        const status = await transactionStatus({paymentReference:req.body.paymentReference});
        if((hash !== req.body.transactionHash)&&(status.responseBody.paymentStatus !== "PAID")){
            res.status(400).send({
                status: false,
                msg: 'Error with input',
                data: null,
                statusCode: 400
            });
        }
        const opts = {session,new:true};
        if(req.body.paymentMethod=== "ACCOUNT_TRANSFER"){
            const accountDetails =  await accountModel.findOne({"accountNumber":req.body.accountDetails.accountNumber});
            const credit = await creditAccount({amount:req.body.amountPaid,userId:accountDetails.userId,
                purpose: "deposit",reference:req.body.paymentReference, opts});
        }
        
          await session.commitTransaction();
            session.endSession();
       return  res.status(200).send({
            status: true,
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