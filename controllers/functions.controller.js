const resetPinSchema= require('../models/admin/admin.resetpin.model')
const {randomPin} = require('../utils/randomGenerator')
const {v1 : uuidv1} = require('uuid')

const setPasswordResetId = async (email) => {
    // const pinLength = 6
    // const randPin = await randomPin(pinLength)
    const restObj = {
        email,
        id: uuidv1()
    }
    return new Promise ((resolve, reject)=> {
        const ResetPin= new resetPinSchema(restObj)
        ResetPin.save()
        .then((data)=>resolve(data))
        .catch((error)=>reject(error))
    });
};
const setPasswordResetIdUsers = async (email,role) => {
    // const pinLength = 6
    // const randPin = await randomPin(pinLength)
    const restObj = {
        email,
        id: uuidv1(),
        role
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
const deleteId = (email, id) =>{
        try{
            resetPinSchema.findOneAndDelete(
                {email,id},
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
    setPasswordResetId,setPasswordResetIdUsers,
    updatenewpass,deleteId
}