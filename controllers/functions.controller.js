const resetPinSchema= require('../models/admin/admin.resetpin.model')
const {randomPin} = require('../utils/randomGenerator')

const setPasswordResetPin = async (email) => {
    const pinLength = 6
    const randPin = await randomPin(pinLength)
    const restObj = {
        email,
        resetpin: randPin
    }
    return new Promise ((resolve, reject)=> {
        const ResetPin= new resetPinSchema(restObj)
        ResetPin.save()
        .then((data)=>resolve(data))
        .catch((error)=>reject(error))
    });
};
const updatenewpass = (email, newpassword, schema) =>{
    return new Promise((resolve,reject)=>{
        try{
            schema.findOneAndUpdate(
                {email},
                {
                    $set:{"password":newpassword}
                },
                { "new": true}
            ).then((data)=>{resolve(data)})
            .catch((error)=>reject(error))
       }catch(error){
        reject(error)}
    })
}
const deletePin = (email, pin) =>{
        try{
            resetPinSchema.findOneAndDelete(
                {email,resetpin:pin},
                (error,data)=>{
                    if(error){
                        console.log(error)
                    }
                });
       }catch(error){
           console.log(error)
       }
}
module.exports = {
    setPasswordResetPin,
    updatenewpass,deletePin
}