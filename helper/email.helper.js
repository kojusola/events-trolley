require("dotenv").config();
const nodemailer = require("nodemailer");
const htmlPdf = require("html-pdf");
const ejs = require("ejs");
const htmlToPdfBuffer = require("./convert.html.to.pdf");
const { ticketName } = require("./create.qrcode");
const { schema } = require("../models/admin/admin.auth.model");
const ticketBoughtModel = require("../models/user/ticketsBought");
const ticketModel = require("../models/user/ticket.model");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "eventstrolleys@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = ({ email, id, name, user, type }) => {
  switch (type) {
    case "request-new-password":
      if (user == "admin") {
        var info = {
          from: '"Event Trolley" eventstrolleys@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Password reset", // Subject line
          text: `Hello ${name},To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}`, // plain text body
          html: `<p><b>Hello ${name},</b><p>
                    To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}
                    <p>This link would expire in one hour</p>`, // html body
        };
        send(info);
        break;
      } else {
        var info = {
          from: '"Event Trolley" eventstrolleys@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Password reset", // Subject line
          text: `Hello ${name},To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}`, // plain text body
          html: `<p><b>Hello ${name},</b><p>
                    To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}
                    <p>This link would expire in one hour</p>`, // html body
        };
        send(info);
        break;
      }
    case "password-update-success":
      var info = {
        from: '"Event Trolley" fernando.cummings@ethereal.email', // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: ` Hello ${name},Your new password has been updated`, // plain text body
        html: `<p><b>Hello ${name},</b><p>
            <p>Your new password has been updated</p>`, // html body
      };
      send(info);
      break;
    default:
      break;
  }
};
const getPinByEmailPin = (email, pin, schema) => {
  return new Promise((resolve, reject) => {
    try {
      schema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
const sendTicket = async ({ attachments, customerName, email }) => {
  var info = {
    from: '"Events Trolley" eventstrolleys@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Ticket Receipt", // Subject line
    text: `Hello ${customerName}`, // plain text body
    html: `<p><b>Hello ${customerName},</b><p>
            <p>These are your receipts. Thank you patronizing Events trolley</p>`, // html body
    attachments: attachments,
  };
  send(info);
};

const sendAccountDetails = async ({
  accountName,
  accountNumber,
  bank,
  email,
  customerName,
}) => {
  // console.log(accountName, accountNumber, bank)
  var info = {
    from: '"Events Trolley" eventstrolleys@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Account Details", // Subject line
    text: `Hello ${customerName}`, // plain text body
    html: `<p><b>Hello ${customerName},</b><p>
            <p>
            You can now top up your Events Trolley wallet instantly by simply doing a bank transfer to this account number<br>
            <b>
            Account Name: ${accountName} <br>
            Account Number:${accountNumber} <br>
            Account Bank: ${bank} <br>
            <b><br></p>
            <p>This is instant and immediately you do the transfer, 
            your wallet balance will be updated immediately. 
            You can transfer at any time without even coming to our application and your balance will be topped up immediately.<br>
            
            This account number is dedicated to you.
            You can save this account number as a beneficiary on your banking apps to make transferring even easier.
            Remember you can also transfer via your bank’s USSD.<br>
            
            Please note that this account number is virtual and is simply linked to your EventTrolley wallet. 
            You cannot actually interact with this account at the bank.</p>`, // html body
  };
  send(info);
};

module.exports = {
  emailProcessor,
  getPinByEmailPin,
  sendTicket,
  sendAccountDetails,
};
