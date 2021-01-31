const vendorModel = require('../../../models/user/vendor.auth.model');
const {newTicketValidation} = require('../../../middlewares/user/user.ticket.validation');
const ticketModel = require('../../../models/user/ticket.model');
const mongoose = require('mongoose');
const userAuthValidation = require('../../../middlewares/user/user.auth.validation');


exports.createNewTicket= async(req, res) => {
    const { error } = newTicketValidation(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    };
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const opts = {session,new:true};
        const ticket = new ticketModel({
            vendor_id: req.params.id,
            event_name: req.body.event_name,
            eventVenue: req.body.eventVenue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            categories: req.body.categories,
            verified: req.body.verified,
        });
        await ticket.save(opts);
        const vendor = await vendorModel.findOneAndUpdate({"_id":ticket.vendor_id},{$push :{ticket:ticket}},opts);
        await session.commitTransaction();
        session.endSession();
        if(vendor){
            res.status(200).json({
                status: true,
                msg: 'Ticket successfully created',
                data: {
                    vendor
                },
                statusCode: 200
            })
        }else{
        res.status(400).json({
            status: true,
            msg: 'Ticket not created',
            statusCode: 400
        })
    }
    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
};

exports.getOneTicket= async(req, res) => {
    try{
        const ticket = await ticketModel.findOne({"_id":req.params.ticket_id});
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket request successful.',
                data: {
                    ticket
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: true,
                msg: 'Ticket does not exist.',
                statusCode: 400
            })
        }
    }catch{
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.getAllTickets= async(req, res) => {
    try{
        const tickets = await ticketModel.find();
        if(tickets){
            res.status(200).json({
                status: true,
                msg: 'Tickets request successful.',
                data: {
                    tickets
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: true,
                msg: 'there are no tickets',
                statusCode: 400
            })
        }
    }catch{
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.getVerifiedTickets= async(req, res) => {
    try{
        const tickets = await ticketModel.find({"verified":true});
        if(tickets){
            res.status(200).json({
                status: true,
                msg: 'Ticket request successful.',
                data: {
                    tickets
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: true,
                msg: 'Ticket does not exist.',
                statusCode: 400
            })
        }
    }catch{
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.deleteTicket= async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const opts = {session};
        const ticket = await ticketModel.findOneAndDelete({"_id":req.params.ticket_id},opts);
        const ticketVend = await vendorModel.findOneAndDelete({"ticket._id":req.params.ticket_id},opts);
        await session.commitTransaction();
        session.endSession();
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket successfully deleted.',
                data: {
                    ticket
                },
                statusCode: 200
            })
        }else{
            res.status(200).json({
                status: true,
                msg: 'Ticket not deleted.',
                data: {
                    ticket,ticketVend
                },
                statusCode: 200
            })
        }
    }catch(error){
        await session.abortTransaction();
        session.endSession()
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.updateTicket= async(req, res) => {
    try{
        const update = req.body
        const ticket = await ticketModel.findOneAndUpdate({"_id":req.params.ticket_id},update,{new:true});
        const vendor = await vendorModel.findOneAndUpdate({"ticket._id":req.params.ticket_id},update,{new:true});
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket updated.',
                data: {
                    ticket
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: true,
                msg: 'Ticket not updated.',
                statusCode: 200
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