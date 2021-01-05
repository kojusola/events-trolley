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
module.exports = {
    setPasswordResetPin
}