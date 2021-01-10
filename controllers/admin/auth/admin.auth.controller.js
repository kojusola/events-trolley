require('dotenv').config();
const adminUserModel = require('../../../models/admin/admin.auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation,resetPasswordValidation,emailValidation } = require('../../../middlewares/admin/admin.auth.validation');
const { createAccessJWT, createRefreshJWT,storeUserRefreshJWT } = require('../../../createVerifytoken')
const resetPinSchema= require('../../../models/admin/admin.resetpin.model')
const {setPasswordResetId,updatenewpass,deleteId}= require('../../functions.controller')
const {emailProcessor,getPinByEmailPin} = require('../../../helper/email.helper')

exports.adminLogin = async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    }

    try {
        //check if admin exists
        const admin = await adminUserModel.findOne({ email: req.body.email });
        const oopsMessage = 'Oops, Your email or password is incorrect'
        if (!admin) {
            return res.status(401).json({
                status: false,
                msg: oopsMessage,
                data: null,
                statusCode: 401
            })
        }
        //validate password
        const validatePassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validatePassword) {
            return res.status(401).json({
                status: false,
                msg: oopsMessage,
                data: null,
                statusCode: 401
            })
        }
        //assign token
          //assign assess and refresh tokens
          const accessJWT = await createAccessJWT(admin.email, admin.id)
          //const refreshJWT = await createRefreshJWT(admin.email)
          //const stored =  await storeUserRefreshJWT(admin.id, refreshJWT,adminUserModel)


        res.status(200).json({
            status: true,
            msg: 'Admin logged in succesfully',
            data: {
                fullname: admin.fullname,
                email: admin.email,
                accessJWT
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.adminRegister = async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    }

    try {
        // check if email exists
        const emailExist = await adminUserModel.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json({
                status: false,
                msg: 'This email already exists',
                statusCode: 400
            });
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //prepare data to save
        const admin = new adminUserModel({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword
        })

        //save admin
        await admin.save();
        res.json({
            status: true,
            msg: 'Admin user successfully created',
            data: {
                fullname: admin.fullname,
                email: admin.email,
            },
            statusCode: 200
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}
exports.resetPassword = async (req,res) =>{
    const {email} = req.body;
    const { error } = emailValidation(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    }
    const adminData = await adminUserModel.findOne({email},(error, data)=>{
        if(error){
            console.log(error);
            res.status(500).send({
                status: false,
                msg: 'Can not find data',
                data: null,
                statusCode: 500
        })
    }
});
if(adminData && adminData._id){
    const nameList = adminData.fullname.split(" ")
    const setId = await setPasswordResetId(email)
    if (setId){
    await emailProcessor({email, id:setId.id,name:nameList[0],type:"request-new-password"})
        return res.json({
            status : "success",
            message:"If email exists in our database, the password reset will be sent shortly"
        });
    }else{
    return res.json({
        status : "success",
        message: "unable to send email at the moment, please try again later"
    });
}
}
    res.json({status:"error", message:" If email exists in our database, the password reset will be sent shortly"})
}
exports.updatePassword = async(req,res)=>{
    const { error } = resetPasswordValidation(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    }
    const {id, newPassword } = req.body
    const getIdData = await resetPinSchema.findOne({id},(error, data)=>{
        if(error){
            console.log(error);
            res.status(500).send({
                status: false,
                msg: 'Can not find pin data',
                data: null,
                statusCode: 500
        })
    }
});
try{
    if(getIdData._id){
        const dbDate = getIdData.createdAt;
        console.log(dbDate)
        const expiresIn = 1;

        let expDate = dbDate.setDate(dbDate.getDate()+ expiresIn);
        console.log(expDate);
        const today = new Date();
        if (today > expDate){
            return res.json({
                status:"error",
                message:"Invalid or expired link."
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        const user  = await updatenewpass (getIdData.email,hashedNewPassword,adminUserModel);
        if(user._id){
            const nameList = user.fullname.split(" ")
            await emailProcessor({email:user.email, name: nameList[0],user: "admin",type:"password-update-success"})
        //delete pin from db
            await deleteId(user.email, id)
            res.json({status:"success", message:"Your password has been up dated"})
        }
    }
}catch(error){
    console.log(error);
    res.json({status:"error", message:"unable to update your password. pleasee try again later"})
}
}
// exports.updatePassword = async (req,res) =>{
//     const {email,pin,newPassword} =req.body;

//     const getPin = await getPinByEmailPin(email,pin,resetPinSchema);
// }
