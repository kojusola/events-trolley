const joi = require('@hapi/joi');

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(3).required().email(),
        password: joi.string().min(3).required(),
        role: joi.string().min(3).required()
    })
    return schema.validate(data)
}
const customerRegisterValidation = (data) => {
    const schema = joi.object({
        fullname: joi.string().min(6).required(),
        email: joi.string().min(5).required().email(),
        mobileNumber: joi.string().min(5).required(),
        gender: joi.string().min(3).required(),
        password: joi.string().min(3).required(),
        role: joi.string().min(3).required()
    })
    return schema.validate(data)
}

const vendorRegisterValidation = (data) => {
    const schema = joi.object({
        fullname: joi.string().min(6).required(),
        email: joi.string().min(5).required().email(),
        mobileNumber: joi.string().min(5).required(),
        password: joi.string().min(3).required(),
        businessName: joi.string().min(3).required(),
        businessNumber: joi.string().min(3).required(),
        location: joi.string().min(2).required(),
        gender: joi.string().min(3).required(),
        socials: joi.object().required(),
        serviceType: joi.string().min(3).required(),
        role: joi.string().min(3).required()

    })
    return schema.validate(data);
}
const emailValidation =(email)=>{
    const schema = joi.object({
        email: joi.string().min(5).required().email(),
        role: joi.string().min(3).required()
    });
    return schema.validate(email);
}
const resetPasswordValidation=(data)=>{
    const schema = joi.object({
        email: joi.string().min(5).required().email(),
        pin:joi.string().min(6).required(),
        newPassword:joi.string().min(6).required(),
        role: joi.string().min(3).required()
    });
    return schema.validate(data);
}
module.exports = { loginValidation, customerRegisterValidation, vendorRegisterValidation,
    emailValidation,resetPasswordValidation };