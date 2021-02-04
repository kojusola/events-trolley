const joi = require('@hapi/joi');

const newTicketValidation = (data) => {
    const schema = joi.object({
        vendorId: joi.string(),
        eventName: joi.string().required(),
        eventVenue: joi.string().required(),
        venueAddress: joi.string().required(),
        eventStartDate: joi.date().required(),
        eventEndDate: joi.date().required(),
        ticketStartDate: joi.date().required(),
        ticketEndDate: joi.date().required(),
        category:joi.string().required(),
        categories: joi.array().required(),
        verified: joi.boolean()
    })
    return schema.validate(data);
}
module.exports = {newTicketValidation}