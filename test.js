const axios = require('axios').default;


async function chargeCard() {
    try {
      const charge = await axios.post( "https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts", {
        "accountReference": "abc123",
        "accountName": "Test Reserved Account",
        "currencyCode": "NGN",
        "contractCode": "8389328412",
        "customerEmail": "test@tester.com",
        "bvn": "21212121212",
        "customerName": "John Doe",
        "getAllAvailableBanks": true
      }, {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        }
      });
    } catch(error){
        console.log(error)
    }
};

// chargeCard();

async function chargeCard1() {
    try {
      const charge1 = await axios.post( "https://sandbox.monnify.com/api/v1/auth/login/",{}, {
        headers: {
            Authorization:"Basic TUtfUFJPRF9XRlJMSERBQkZNOkY4Q1NIN0xXOVROWE1aTEQ3UFhGNUNZTVRIUThCOFYz"
        }
      });
          const bankCodes= await axios.get( "https://sandbox.monnify.com/api/v1/banks", {
            headers: {
                Authorization:`Bearer ${charge1.data.responseBody.accessToken} `
            }
          });
          const bankName = "Diamond bank";
          for(let i = 0; i < bankCodes.data.responseBody.length; i++ ){
          if(bankCodes.data.responseBody[i].name === bankName){
            const bankCode = bankCodes.data.responseBody[i].code;
            return  bankCode
        }
      }
    }catch(error){
        console.log(error)
    }
};
const hello = chargeCard1();
console.log(hello);
const crypto = require('crypto')
const calculateHash = async function(){
  try{
      let hash = await crypto.createHash('sha512');
      let data = hash.update('adeola', 'utf-8');
      let gen_hash= data.digest('hex')
      console.log(gen_hash);
  }catch(error){
  console.log(error)
  }
}


// calculateHash();
