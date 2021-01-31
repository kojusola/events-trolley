const joi = require('@hapi/joi');

const newTicketValidation = (data) => {
    const schema = joi.object({
        vendor_id: joi.string(),
        event_name: joi.string().required(),
        eventVenue: joi.string().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required(),
        categories: joi.array().required(),
        verified: joi.boolean()
    })
    return schema.validate(data);
}
module.exports = {newTicketValidation}