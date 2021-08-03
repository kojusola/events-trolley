const joi = require('@hapi/joi');

const newTicketValidation = (data) => {
    const schema = joi.object({
        vendorId: joi.string(),
        eventName: joi.string().required(),
        eventVenue: joi.string().required(),
        venueAddress: joi.string().required(),
        eventStartDate: joi.string().required(),
        eventTime: joi.string().required(),
        eventEndDate: joi.string().required(),
        ticketStartDate: joi.string().required(),
        ticketEndDate: joi.string().required(),
        category:joi.string().required(),
        // categories: joi.string().required(),
        categories: joi.array(),
        // categories: joi.array().items(joi.object({
        //     ticketName:joi.string().required(),
        //     description:joi.string().required(),
        //     numberOfTickets:joi.number(),
        //     price:joi.string()
        // })).required(),
        verified: joi.boolean()
    })
    return schema.validate(data);
}
const validateImage = (file) =>{
    console.log((file.image.mimetype !== 'image/jpeg'))
    if(JSON.stringify(file) === 'null'){
        return {
            bol: true,
            msg:"image required"
        }
    }else if((file.image.mimetype === 'image/jpeg') && (file.image.mimetype === 'image/png') && (file.image.mimetype === 'image/jpg')){
        return {
            bol: true,
            msg:"The image extension should either be jpeg/png/jpg"
        }
    } else if (file.image.size > 10*1024*1024){
        return {
            bol: true,
            msg:"image is not of the right size"
        }
    }
    return {
        bol:false
    }
}

const buyTicketValidation = (data) => {
    const schema = joi.object({
        ticketId: joi.string().required(),
        userId:joi.string(),
        customerName:joi.string(),
        customerEmail:joi.string(),
        paymentReference:joi.string(),
        amount: joi.number().required(),
        tickets: joi.array().required()
    })
    return schema.validate(data);
}
module.exports = {newTicketValidation,validateImage,buyTicketValidation}