const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'darion78@ethereal.email',
        pass: 'Azf6ycrJt6dvEMdHG1'
    }
});

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

const emailProcessor = (email, pin)=>{
    const info = 
        {
            from: '"Event Trolley" fernando.cummings@ethereal.email', // sender address
            to: email, // list of receivers
            subject: "Password reset Pin", // Subject line
            text: `Here is your password reset pin ${pin} this pin would expire in one day`, // plain text body
            html: `<p><b>Hello</b><p>
            here is your pin 
            <b>${pin}<b>
            <p>This pin would expire in one day</p>`, // html body
          }
          send(info);
}

module.exports = {emailProcessor}