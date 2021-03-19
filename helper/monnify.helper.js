require('dotenv').config();
const axios = require('axios').default;

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
}
module.exports = {getHeader,getAccount}