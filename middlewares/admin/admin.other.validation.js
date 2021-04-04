const joi = require('@hapi/joi');

const roleValidation = (data) => {
    const schema = joi.object({
        role: joi.string().min(3).required()
    })
    return schema.validate(data);
}

const percentageValidation = (data) => {
    const schema = joi.object({
        vendorPayoutPercentage: joi.number().required()
    })
    return schema.validate(data);
}

module.exports ={roleValidation,percentageValidation}