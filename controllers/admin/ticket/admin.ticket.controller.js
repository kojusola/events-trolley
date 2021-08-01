const ticketModel = require('../../../models/user/ticket.model');
const profileModel = require('../../../models/user/profile.model');
const {percentageValidation} = require('../../../middlewares/admin/admin.other.validation')

exports.getAllTickets= async(req, res) => {
    try{
        const {page, perPage} = req.query;
        const options ={
            page: parseInt(page,10) || 1,
            limit: parseInt(perPage,10) || 10
        }
        const tickets = await ticketModel.paginate({},options);
        if(tickets){
            res.status(200).json({
                status: true,
                msg: 'Tickets request successful.',
                data: {
                    tickets:tickets.docs,
                    page:tickets.page,
                    pages:tickets.pages,
                    totalTickets: tickets.total,
                    limit:tickets.limit
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'there are no tickets',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.getAllVendors= async(req, res) => {
    try{
        const {page, perPage} = req.query;
        const options ={
            page: parseInt(page,10) || 1,
            limit: parseInt(perPage,10) || 10
        }
        const vendors = await profileModel.paginate({},options);
        if(vendors){
            res.status(200).json({
                status: true,
                msg: 'Tickets request successful.',
                data: {
                    tickets:vendors.docs,
                    page:vendors.page,
                    pages:vendors.pages,
                    totalTickets: vendors.total,
                    limit:vendors.limit
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'there are no Vendors',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.verifyTicket= async(req, res) => {
    try{ 
        const ticket = await ticketModel.findOneAndUpdate({"_id":req.query.ticket_id}
        ,{"$set":{"verified":true}},{new:true});
        const vendorTickets = await ticketModel.find({"vendorId":ticket.vendorId});
        const ticketVend = await profileModel.updateOne({"userId":ticket.vendorId},
        {"$set":{"ticket":vendorTickets}},{ safe:true,new:true});
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket verified',
                data: {
                    ticket
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'Ticket not verified',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}
exports.revokeTicket= async(req, res) => {
    try{ 
        const ticket = await ticketModel.findOneAndUpdate({"_id":req.query.ticket_id}
        ,{"$set":{"verified":false}},{new:true});
        const vendorTickets = await ticketModel.find({"vendorId":ticket.vendorId});
        const ticketVend = await profileModel.updateOne({"userId":ticket.vendorId},
        {"$set":{"ticket":vendorTickets}},{ safe:true,new:true});
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket revoked',
                data: {
                    ticket
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'Ticket not revoked',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.updateVendorPayoutPercentage = async(req, res) => {
    try{ 
        const { error } = percentageValidation(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                msg: error.details[0].message,
                data: null,
                statusCode: 400
            });
        };
        const payoutPercentage = await parseInt(req.body.vendorPayoutPercentage);
        const profile = await profileModel.findOneAndUpdate({"userId":req.query.userId}
        ,{"$set":{"vendorPayoutPercentage":payoutPercentage}},{new:true});
        if(profile){
            res.status(200).json({
                status: true,
                msg: 'Vendor Payment Percentage Updated',
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'Vendor Payment Percentage Updated: Vendor Profile does not exist',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}