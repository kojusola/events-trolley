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
        buisnessName: joi.string().min(3).required(),
        buisnessNumber: joi.string().min(3).required(),
        location: joi.string().min(2).required(),
        gender: joi.string().min(3).required(),
        socials: joi.object().required(),
        serviceType: joi.string().min(3).required(),
        role: joi.string().min(3).required()

    })
    return schema.validate(data);
}
module.exports = { loginValidation, customerRegisterValidation, vendorRegisterValidation };