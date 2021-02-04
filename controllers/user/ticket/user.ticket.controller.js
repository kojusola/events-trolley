const vendorModel = require('../../../models/user/vendor.auth.model');
const {newTicketValidation} = require('../../../middlewares/user/user.ticket.validation');
const ticketModel = require('../../../models/user/ticket.model');
const mongoose = require('mongoose');
const userAuthValidation = require('../../../middlewares/user/user.auth.validation');
const upload = require("../../../helper/multer");
const cloudinary = require("../../../helper/cloudinary");


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
        const result = await cloudinary.uploader.upload(req.file.path); 
        const opts = {session,new:true};
        const ticket = new ticketModel({
            vendorId: req.userId,
            eventName: req.body.eventName,
            eventVenue: req.body.eventVenue,
            venueAddress: req.body.venueAddress,
            eventStartDate: req.body.startDate,
            eventEndDate: req.body.endDate,
            ticketStartDate: req.body.endDate,
            ticketEndDate: req.body.endDate,
            ticketImage:
             {
                avatar:result.secure_url,
                cloundinaryId: result.public_id
            },
            category:req.body.category,
            categories: req.body.categories,
            verified: req.body.verified,
        });
        await ticket.save(opts);
        const vendor = await (await vendorModel.findOneAndUpdate({"_id":ticket.vendorId},{$push :{ticket:ticket}},opts));
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
            status: false,
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
        const ticket = await ticketModel.findOne({"_id":req.query.ticket_id});
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
                status: false,
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
                status: false,
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
                status: false,
                msg: 'Ticket does not exist.',
                statusCode: 400
            })
        }
    }catch (error){
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
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try{
        // const opts = {session};
        const ticket = await ticketModel.findOneAndDelete({"_id":req.query.ticket_id});
        console.log(req.userId)
        const ticketVend = await vendorModel.updateOne({"_id":req.userId},{"$pull":{"ticket":ticket}},{ safe:true,new:true});
        // await session.commitTransaction();
        // session.endSession();
        if(ticket){
            res.status(200).json({
                status: true,
                msg: 'Ticket successfully deleted.',
                data: {
                    ticket,ticketVend 
                },
                statusCode: 200
            });
        }else{
            res.status(400).json({
                status: false,
                msg: 'Ticket does not exist.',
                data: {
                    ticketVend
                },
                statusCode: 400
            })
        }
    }catch(error){
        // await session.abortTransaction();
        // session.endSession()
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
        const ticketIn = await ticketModel.findOne({"_id":req.query.ticket_id})
        const ticket = await ticketModel.findOneAndUpdate({"_id":req.query.ticket_id},update,{new:true});
        const requiredObj = vendorModel.filter((item)=>item.id = req.query.ticket_id);
        console.log(requiredObj)
        // const ticketVend = await vendorModel.updateOne({"_id":req.userId},{"$pull":{"ticket":ticketIn}},{ safe:true,new:true});
        console.log(vendor)
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
                status: false,
                msg: 'Ticket not updated.',
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

exports.updateTicketImage = async (req, res) => {
    try{
        const result = await cloudinary.uploader.upload(req.file.path); 
        console.log(result);
        const updateTicket = await ticketModel.findByIdAndUpdate({_id: req.query.ticket_id}, {ticketImage: {avatar:result.secure_url,cloundinaryId: result.public_id}}, {new: true});
        console.log(updateTicket)
        const updateProfile = await vendorModel.updateOne({"_id":req.userId,"ticket._id": req.query.ticket_id},{"$set":{"ticketImage":{avatar:result.secure_url,cloundinaryId: result.public_id}}},{new:true});
        console.log(updateProfile);
        if(!updateProfile){
           return res.status(400).json({
                status: false,
                msg: 'Ticket image not updated.',
                statusCode: 400
            });
        }
        return res.status(200).json({
            status: true,
            msg: 'Ticket image updated.',
            data: {
                updateTicket 
            },
            statusCode: 200
        })
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

exports.vendorTickets= async(req, res) => {
    try{
        const ticket = await ticketModel.find({"vendor_id":req.userId});
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
                status: false,
                msg: 'There are no tickets created by the user.',
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