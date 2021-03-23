require('dotenv').config();
const axios = require('axios').default;
const crypto = require('crypto')

const getHeader = async function() {
    try {
      const header = await axios.post( "https://sandbox.monnify.com/api/v1/auth/login/",{}, {
        headers: {
            Authorization:`Basic ${process.env.MONNIFY_API_SECRET_KEY}`
        }
      });
      return header.data
    }catch(error){
        console.log(error)
    }
};
const getAccount = async function({header,accountName, accountReference,customerEmail, customerBvn, accessToken}){
    try{
        if(header.requestSuccessful){
            const accountDetails = await axios.post( "https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts", {
                "accountReference": accountReference,
                "accountName": accountName,
                "currencyCode": "NGN",
                "contractCode": process.env.CONTRACT_CODE,
                "customerEmail": customerEmail,
                "bvn": customerBvn,
                "customerName": accountName,
                "getAllAvailableBanks": false,
                "preferredBanks": ["035"]
                }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
                });
            return accountDetails.data;
        }
    }catch(error){
        console.log(error)
    }
};

const getBankCodes = async function(accessToken,bankName) {
    try {
      const bankCodes= await axios.get( "https://sandbox.monnify.com/api/v1/banks", {
        headers: {
            Authorization:`Bearer ${accessToken}`
        }
      });
        for(let i = 0; i < bankCodes.data.responseBody.length; i++ ){
        if(bankCodes.data.responseBody[i].name === bankName){
        const bankCode = bankCodes.data.responseBody[i].code;
        return bankCode;
        }
    }
    }catch(error){
        console.log(error)
    }
}
const payOut = async function({header,amount, destinationAccountNumber,transactionReference, bankCode}){
    try{
        if(header.requestSuccessful){
            const payOut = await axios.post( "https://sandbox.monnify.com/api/v2/disbursements/single", {
                    "amount": amount,
                    "reference":transactionReference,
                    "narration":"Ticket Payout",
                    "destinationBankCode": bankCode ,
                    "destinationAccountNumber": destinationAccountNumber,
                    "currency": "NGN",
                    "sourceAccountNumber": process.env.WALLET_ACCOUNT_NUMBER 
                }, {
                headers: {
                    Authorization: `Basic ${process.env.MONNIFY_API_SECRET_KEY}`,
                }
                });
            return payOut.data;
        }
    }catch(error){
        console.log(error)
    }
};
const validateOtp = async function({reference,authorizationCode}){
    try{
            const validate = await axios.post( "http://sandbox.monnify.com/api/v2/disbursements/single/validate-otp", {
                "reference":reference,
                "authorizationCode": authorizationCode
                }, {
                headers: {
                    Authorization: `Basic ${process.env.MONNIFY_API_SECRET_KEY}`,
                }
                });
            return validate.data;
    }catch(error){
        console.log(error)
    }
};
const calculateHash = async function({paymentReference,amountPaid,paidOn,transactionReference}){
    try{
        let hash = await crypto.createHash('sha512');
      let data = hash.update(`${process.env.MONNIFY_CLIENT_SECRET_KEY}|${paymentReference}|${amountPaid}|${paidOn}|${transactionReference}`, 'utf-8');
      const gen_hash= data.digest('hex');
      return gen_hash
    }catch(error){
    console.log(error)
    }
};

const transactionStatus = async function({paymentReference}){
    try{
            const status= await axios.get( `https://sandbox.monnify.com/api/v1/merchant/transactions/query?paymentReference=${paymentReference}`, {
                headers: {
                    Authorization: `Basic ${process.env.MONNIFY_API_SECRET_KEY}`,
                }
                });
            return status.data;
    }catch(error){
        console.log(error)
    }
};
module.exports = {getHeader,getAccount,getBankCodes,payOut,validateOtp,calculateHash,transactionStatus}