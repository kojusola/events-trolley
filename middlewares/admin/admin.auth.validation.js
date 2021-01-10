const joi = require('@hapi/joi');

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(3).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}
const registerValidation = (data) => {
    const schema = joi.object({
        fullname: joi.string().min(6).required(),
        email: joi.string().min(5).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}
const emailValidation =(email)=>{
    const schema = joi.object({
        email: joi.string().min(5).required().email()
    });
    return schema.validate(email);
}
const resetPasswordValidation=(data)=>{
    const schema = joi.object({
        id:joi.string().min(3).required(),
        newPassword:joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports = { loginValidation, registerValidation,resetPasswordValidation,emailValidation };