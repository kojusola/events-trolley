const joi = require('@hapi/joi');

const newTicketValidation = (data) => {
    const schema = joi.object({
        vendorId: joi.string(),
        eventName: joi.string().required(),
        eventVenue: joi.string().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required(),
        category:joi.string().required(),
        categories: joi.array().required(),
        verified: joi.boolean()
    })
    return schema.validate(data);
}
module.exports = {newTicketValidation}