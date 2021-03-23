const ticketModel = require("../models/user/ticket.model")

const reduceNumber = function(ticketId, categoryName){
    const ticket =  ticketModel.findOne({"vendorId":ticketId,"category.Name":categoryName },
    {$inc : {'numberOfTickets': -1}});
    return ticket;
}

module.exports = { reduceNumber };