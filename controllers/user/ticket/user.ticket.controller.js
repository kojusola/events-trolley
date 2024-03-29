const ticketBoughtModel = require("../../../models/user/ticketsBought");
const slug = require("slug");
const { v4 } = require("uuid");
const {
  newTicketValidation,
  validateImage,
  buyTicketValidation,
} = require("../../../middlewares/user/user.ticket.validation");
const ticketModel = require("../../../models/user/ticket.model");
const profileModel = require("../../../models/user/profile.model");
const mongoose = require("mongoose");
const userAuthValidation = require("../../../middlewares/user/user.auth.validation");
const upload = require("../../../helper/multer");
const { sendTicket } = require("../../../helper/email.helper");
const cloudinary = require("../../../helper/cloudinary");
const { reduceNumber } = require("../../../helper/reduceTicketNumber");
const { creditAccount, debitAccount } = require("../../../helper/transactions");
const { generateQR } = require("../../../helper/create.qrcode");
const htmlToPdfBuffer = require("../../../helper/convert.html.to.pdf");
const { payoutAmount } = require("../../../helper/payoutPercentage.helper");
const { transactionStatus } = require("../../../helper/monnify.helper");

exports.createNewTicket = async (req, res) => {
  // const { error } = newTicketValidation(req.body)
  // if (error) {
  //     return res.status(400).json({
  //         status: false,
  //         msg: error.details[0].message,
  //         data: null,
  //         statusCode: 400
  //     });
  // };
  const message = await validateImage(req.files);
  if (message.bol) {
    return res.status(400).json({
      status: false,
      msg: message.msg,
      data: null,
      statusCode: 400,
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath
    );
    const opts = { session, new: true };
    const vendorDetails = await profileModel.findOne(
      { userId: req.userId },
      null,
      opts
    );
    const slugName = slug(req.body.eventName);
    const ticket = new ticketModel({
      slugEventName: slugName,
      vendorId: req.userId,
      eventName: req.body.eventName,
      eventVenue: req.body.eventVenue,
      eventTime: req.body.eventTime,
      venueAddress: req.body.venueAddress,
      eventStartDate: req.body.eventStartDate,
      eventEndDate: req.body.eventEndDate,
      ticketSaleStartDate: req.body.ticketStartDate,
      ticketSaleEndDate: req.body.ticketEndDate,
      description: req.body.description,
      mobileNumber: vendorDetails.mobileNumber,
      email: vendorDetails.email,
      ticketImage: {
        avatar: result.secure_url,
        cloundinaryId: result.public_id,
      },
      category: req.body.category,
      categories: JSON.parse(req.body.categories),
      verified: req.body.verified,
    });
    await ticket.save(opts);
    console.log(ticket);
    const vendor = await profileModel.findOneAndUpdate(
      { userId: ticket.vendorId },
      { $push: { ticket: ticket } },
      opts
    );
    await session.commitTransaction();
    session.endSession();
    if (vendor) {
      res.status(200).json({
        status: true,
        msg: "Ticket successfully created",
        data: {
          vendor,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "Ticket not created",
        statusCode: 400,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.getOneTicket = async (req, res) => {
  try {
    const ticket = await ticketModel.findOne({ slugEventName: req.query.slug });
    if (ticket) {
      res.status(200).json({
        status: true,
        msg: "Ticket request successful.",
        data: {
          ticket,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "Ticket does not exist.",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find();
    if (tickets) {
      res.status(200).json({
        status: true,
        msg: "Tickets request successful.",
        data: {
          tickets,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "there are no tickets",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.getVerifiedTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find({ verified: true });
    if (tickets) {
      res.status(200).json({
        status: true,
        msg: "Ticket request successful.",
        data: {
          tickets,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "Ticket does not exist.",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.deleteTicket = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    // const opts = {session};
    const ticket = await ticketModel.findOneAndDelete({
      _id: req.query.ticket_id,
    });
    console.log(req.userId);
    console.log(ticket);
    const ticketVend = await profileModel.updateOne(
      { userId: req.userId },
      { $pull: { ticket: ticket } },
      { safe: true, new: true }
    );
    // await session.commitTransaction();
    // session.endSession();
    if (ticket) {
      res.status(200).json({
        status: true,
        msg: "Ticket successfully deleted.",
        data: {
          ticket,
          ticketVend,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "Ticket does not exist.",
        data: {
          ticketVend,
        },
        statusCode: 400,
      });
    }
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession()
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const update = req.body;
    // const ticketIn = await ticketModel.findOne({"_id":req.query.ticket_id});
    const ticket = await ticketModel.findOneAndUpdate(
      { _id: req.query.ticket_id },
      update,
      { new: true }
    );
    const vendorTickets = await ticketModel.find({ vendorId: req.userId });
    // const requiredObj = await vendor.ticket
    // .filter((item)=>item._id = req.query.ticket_id);
    // requiredObj.updateOne({},{item:ticket},{new:true});
    // console.log(requiredObj)
    const ticketVend = await profileModel.updateOne(
      { userId: req.userId },
      { $set: { ticket: vendorTickets } },
      { safe: true, new: true }
    );
    if (ticket) {
      res.status(200).json({
        status: true,
        msg: "Ticket updated.",
        data: {
          ticket,
          ticketVend,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "Ticket not updated.",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.updateTicketImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    const updateTicket = await ticketModel.findByIdAndUpdate(
      { _id: req.query.ticket_id },
      {
        ticketImage: {
          avatar: result.secure_url,
          cloundinaryId: result.public_id,
        },
      },
      { new: true }
    );
    console.log(updateTicket);
    const updateProfile = await profileModel.updateOne(
      { userId: req.userId, "ticket._id": req.query.ticket_id },
      {
        $set: {
          ticketImage: {
            avatar: result.secure_url,
            cloundinaryId: result.public_id,
          },
        },
      },
      { new: true }
    );
    console.log(updateProfile);
    if (!updateProfile) {
      return res.status(400).json({
        status: false,
        msg: "Ticket image not updated.",
        statusCode: 400,
      });
    }
    return res.status(200).json({
      status: true,
      msg: "Ticket image updated.",
      data: {
        updateTicket,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.vendorTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find({ vendorId: req.userId });
    if (tickets) {
      res.status(200).json({
        status: true,
        msg: "Ticket request successful.",
        data: {
          tickets,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "There are no tickets created by the user.",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.regBuyTicket = async (req, res) => {
  const { error } = buyTicketValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details[0].message,
      data: null,
      statusCode: 400,
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const ticketDetails = await ticketModel.findOne({ _id: req.body.ticketId });
    if (!ticketDetails) {
      return res.status(400).send({
        status: true,
        msg: "Ticket Does not exist",
        data: null,
        statusCode: 400,
      });
    }
    const customerDetails = await profileModel.findOne({
      userId: req.body.userId,
    });
    console.log(customerDetails, req.body.userId);
    console.log(ticketDetails);
    console.log(ticketDetails.vendorId);
    const vendorDetails = await profileModel.findOne({
      userId: ticketDetails.vendorId,
    });
    console.log(vendorDetails);
    const debit = await debitAccount({
      amount: req.body.amount,
      userId: req.body.userId,
      reference: v4(),
      purpose: "payment",
      opts,
    });
    const credit = await creditAccount({
      amount: req.body.amount,
      userId: ticketDetails.vendorId,
      reference: v4(),
      purpose: "payment",
      metadata: debit.reference,
      opts,
    });
    console.log(!credit.success, !debit.success);
    if (!credit.success || !debit.success) {
      return res.status(200).send({
        status: true,
        msg: credit.msg || debit.msg,
        data: null,
        statusCode: 200,
      });
    }
    const tickets = req.body.tickets;
    const attachments = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = await ticketModel.findOneAndUpdate(
        {
          _id: req.body.ticketId,
          "categories.ticketName": tickets[i].ticketType,
        },
        { $inc: { "categories.$.numberOfTickets": -1 } },
        opts
      );
      const ticketsBought = new ticketBoughtModel({
        vendorId: req.body.vendorId,
        customerId: req.body.userId,
        ticketId: req.body.ticketId,
        ticketUserName: tickets[i].name,
        ticketType: tickets[i].ticketType,
        eventName: ticketDetails.eventName,
        eventVenue: ticketDetails.eventVenue,
        eventTime: ticketDetails.eventTime,
        venueAddress: ticketDetails.venueAddress,
        eventStartDate: ticketDetails.eventStartDate,
        eventEndDate: ticketDetails.eventEndDate,
      });
      await ticketsBought.save(opts);
      let qrCodeImage = generateQR(
        `name : ${tickets[i].name}, TicketName: ${tickets[i].ticketType}, ticketId: ${ticketsBought._id}`
      );
      let ticketUserName = tickets[i].name;
      let fileBuffer = await htmlToPdfBuffer("receipt.ejs", {
        ticketUserName,
      });
      let fileObject = {
        filename: "receipt.pdf",
        content: fileBuffer,
      };
      console.log(fileObject);
      attachments.push(fileObject);
    }
    const email = sendTicket({
      attachments: attachments,
      customerName: customerDetails.fullname,
      eventName: ticketDetails.eventName,
      email: customerDetails.email,
    });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({
      status: true,
      msg: "Ticket sale successful",
      data: null,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.buyTicket = async (req, res) => {
  const { error } = buyTicketValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details[0].message,
      data: null,
      statusCode: 400,
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // const status = await transactionStatus({
    //   paymentReference: req.body.paymentReference,
    // });
    // console.log(status);
    // if (status.responseBody.paymentStatus !== "PAID") {
    //   res.status(400).send({
    //     status: false,
    //     msg: "Payment Failed",
    //     data: null,
    //     statusCode: 400,
    //   });
    // }
    const opts = { session, new: true };
    const ticketDetails = await ticketModel.findOne({ _id: req.body.ticketId });
    if (!ticketDetails) {
      return res.status(400).send({
        status: true,
        msg: "Ticket Does not exist",
        data: null,
        statusCode: 400,
      });
    }
    // console.log(ticketDetails);
    const vendorDetails = await profileModel.findOne({
      userId: ticketDetails.vendorId,
    });
    // console.log(vendorDetails);
    const amount = await payoutAmount({
      amount: req.body.amount,
      percentage: vendorDetails.vendorPayoutPercentage,
    });
    // console.log(amount);
    const credit = await creditAccount({
      amount: amount,
      userId: ticketDetails.vendorId,
      purpose: "payment",
      reference: req.body.paymentReference,
      opts,
    });
    if (!credit.success) {
      return res.status(200).send({
        status: true,
        msg: credit.msg,
        data: null,
        statusCode: 200,
      });
    }
    const tickets = req.body.tickets;
    const attachments = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = await ticketModel.findOneAndUpdate(
        {
          _id: req.body.ticketId,
          "categories.ticketName": tickets[i].ticketType,
        },
        { $inc: { "categories.$.numberOfTickets": -1 } },
        opts
      );
      let ticketUserName = tickets[i].name;
      const ticketsBought = new ticketBoughtModel({
        vendorId: ticketDetails.vendorId,
        customerId: req.body.userId,
        ticketId: req.body.ticketId,
        ticketUserName: ticketUserName,
        ticketType: tickets[i].ticketType,
        eventName: ticketDetails.eventName,
        eventVenue: ticketDetails.eventVenue,
        eventTime: ticketDetails.eventTime,
        venueAddress: ticketDetails.venueAddress,
        eventStartDate: ticketDetails.eventStartDate,
        eventEndDate: ticketDetails.eventEndDate,
      });
      await ticketsBought.save(opts);
      let qrCodeImage = await generateQR(
        `name : ${tickets[i].name}, TicketName: ${tickets[i].ticketType}, TicketId: ${ticketsBought._id}`
      );
      let fileBuffer = await htmlToPdfBuffer("receipt.ejs", {
        ticketUserName,
        ticketsId: ticketsBought._id,
        ticketType: tickets[i].ticketType,
        qrCodeImage,
        logo: ticketDetails.ticketImage.avatar,
        eventName: ticketDetails.eventName,
        eventTime: ticketDetails.eventTime,
        eventVenue: ticketDetails.eventVenue,
      });
      let fileObject = {
        filename: "receipt.pdf",
        content: fileBuffer,
      };
      // console.log(fileObject);
      attachments.push(fileObject);
    }
    const email = await sendTicket({
      attachments: attachments,
      customerName: req.body.customerName,
      eventName: ticketDetails.eventName,
      email: req.body.customerEmail,
    });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({
      status: true,
      msg: "Ticket sale successful",
      data: null,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.confirmTickets = async (req, res) => {
  try {
    const tickets = await ticketBoughtModel.findOneAndUpdate(
      { _id: req.query.ticketId },
      { checkIn: true },
      { new: true }
    );
    if (tickets) {
      res.status(200).json({
        status: true,
        msg: "Ticket checkIn successful",
        data: {
          tickets,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "There are no tickets by this Id",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.boughtTicket = async (req, res) => {
  try {
    const tickets = await ticketBoughtModel.find({ vendorId: req.userId });
    if (tickets) {
      res.status(200).json({
        status: true,
        msg: "bought ticket request successful",
        data: {
          tickets,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        status: false,
        msg: "There are no tickets by his vendor",
        statusCode: 400,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};

exports.freeTicket = async (req, res) => {
  const { error } = buyTicketValidation(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details[0].message,
      data: null,
      statusCode: 400,
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const ticketDetails = await ticketModel.findOne({ _id: req.body.ticketId });
    if (!ticketDetails) {
      return res.status(400).send({
        status: true,
        msg: "Ticket does not exist",
        data: null,
        statusCode: 400,
      });
    }
    const vendorDetails = await profileModel.findOne({
      userId: ticketDetails.vendorId,
    });
    if (req.body.amount !== 0) {
      return res.status(200).send({
        status: true,
        msg: "Ticket is not free",
        data: null,
        statusCode: 200,
      });
    }
    const tickets = req.body.tickets;
    const attachments = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = await ticketModel.findOneAndUpdate(
        {
          _id: req.body.ticketId,
          "categories.ticketName": tickets[i].ticketType,
        },
        { $inc: { "categories.$.numberOfTickets": -1 } },
        opts
      );
      let ticketUserName = tickets[i].name;
      const ticketsBought = new ticketBoughtModel({
        vendorId: req.body.vendorId,
        customerId: req.body.userId,
        ticketId: req.body.ticketId,
        ticketUserName: ticketUserName,
        ticketType: tickets[i].ticketType,
        eventName: ticketDetails.eventName,
        eventVenue: ticketDetails.eventVenue,
        eventTime: ticketDetails.eventTime,
        venueAddress: ticketDetails.venueAddress,
        eventStartDate: ticketDetails.eventStartDate,
        eventEndDate: ticketDetails.eventEndDate,
      });
      await ticketsBought.save(opts);
      let qrCodeImage = await generateQR(
        `name : ${tickets[i].name}, TicketName: ${tickets[i].ticketType}, TicketId: ${ticketsBought._id}`
      );
      let fileBuffer = await htmlToPdfBuffer("receipt.ejs", {
        ticketUserName,
        ticketsId: ticketsBought._id,
        ticketType: tickets[i].ticketType,
        qrCodeImage,
        logo: ticketDetails.ticketImage.avatar,
        eventName: ticketDetails.eventName,
        eventTime: ticketDetails.eventTime,
        eventVenue: ticketDetails.eventVenue,
      });
      let fileObject = {
        filename: "receipt.pdf",
        content: fileBuffer,
      };
      // console.log(fileObject);
      attachments.push(fileObject);
    }
    const email = await sendTicket({
      attachments: attachments,
      customerName: req.body.customerName,
      eventName: ticketDetails.eventName,
      email: req.body.customerEmail,
    });

    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({
      status: true,
      msg: "Ticket sale successful",
      data: null,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({
      status: false,
      msg: "Internal Server Error",
      data: null,
      statusCode: 500,
    });
  }
};
