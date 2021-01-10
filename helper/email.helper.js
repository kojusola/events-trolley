require('dotenv').config()
const nodemailer = require('nodemailer');
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

const emailProcessor = ({email, id, name, type})=>{
    switch(type){
        case "request-new-password":
            var info = {
            from: '"Event Trolley" eventstrolleys@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Password reset", // Subject line
            text: `Hello ${name},To reset your password, please click on this link: https://events-trolley.herokuapp.com/reset/${id}`, // plain text body
            html: `<p><b>Hello ${name},</b><p>
            To reset your password, please click on this link: https://events-trolley.herokuapp.com/reset/${id}
            <p>This link would expire in one hour</p>`, // html body
          }
          send(info);
          break;
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

module.exports = {emailProcessor,getPinByEmailPin}