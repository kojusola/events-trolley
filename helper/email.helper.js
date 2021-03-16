require('dotenv').config()
const nodemailer = require('nodemailer');
const htmlPdf = require('html-pdf');
const ejs = require ('ejs');
const htmlToPdfBuffer = require ('./convert.html.to.pdf');
const { schema } = require('../models/admin/admin.auth.model');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: 'eventstrolleys@gmail.com',
        pass: process.env.EMAIL_PASS
    }
})

const send = (info)=>{
    return new Promise( async(resolve, reject)=>{
        try{
            let result = await  transporter.sendMail(info);
    
            console.log("Message sent: %s", result.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            resolve(result)
        }catch(error){
            console.log(error)
        }
    })

}

const emailProcessor = ({email, id, name,user, type})=>{
    switch(type){
        case "request-new-password":
            if(user=="admin"){
                var info = {
                    from: '"Event Trolley" eventstrolleys@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Password reset", // Subject line
                    text: `Hello ${name},To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}`, // plain text body
                    html: `<p><b>Hello ${name},</b><p>
                    To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}
                    <p>This link would expire in one hour</p>`, // html body
                  }
                  send(info);
                  break;
            }else{
                var info = {
                    from: '"Event Trolley" eventstrolleys@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: "Password reset", // Subject line
                    text: `Hello ${name},To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}`, // plain text body
                    html: `<p><b>Hello ${name},</b><p>
                    To reset your password, please click on this link: https://eventstrolleyfrontend.netlify.app/reset-password?role=${user}&authId=${id}
                    <p>This link would expire in one hour</p>`, // html body
                  }
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
          }
          send(info);
          break;
        default:
          break;
    }
}
const getPinByEmailPin = (email,pin,schema)=>{
    return new Promise ((resolve, reject)=> {
        try{
            schema.findOne({email,pin},(error,data)=>{
                if(error){
                    console.log(error);
                    resolve(false);
                }
                resolve(data);
            });
        } catch (error){
            reject(error);
            console.log(error);
        }
    })
}
const sendTicket = async ({vendorName,ticketUserName,customerName, eventName, eventVenue, eventTime, eventStartDate,eventEndDate,
    ticketName,qrCodeImage, email}) =>{
        const fileBuffer = await htmlToPdfBuffer("receipt.ejs",{
            ticketUserName
          });
        var info = {
            from: '"Events Trolley" eventstrolleys@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Password reset", // Subject line
            text: `Hello ${customerName}`, // plain text body
            html: `<p><b>Hello ${customerName},</b><p>
            <p>This is your ticket receipt. Thank you patronizing Events trolley</p>`, // html body
            attachments : { filename: "receipt.pdf",
                             content: fileBuffer }
          }
        //   send(info);

}

module.exports = {emailProcessor,getPinByEmailPin,sendTicket}