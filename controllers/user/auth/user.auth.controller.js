require('dotenv').config();
const { v4 } = require('uuid');
const customerModel = require('../../../models/user/customer.auth.model');
const vendorModel = require('../../../models/user/vendor.auth.model');
const profileModel = require('../../../models/user/profile.model');
const accountModel = require('../../../models/user/account.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginValidation, customerRegisterValidation, vendorRegisterValidation ,
    emailValidation, resetPasswordValidation} = require('../../../middlewares/user/user.auth.validation');
const { createAccessJWT } = require('../../../createVerifytoken');
const mongoose = require('mongoose');
const resetPinSchema = require('../../../models/admin/admin.resetpin.model')
const { setPasswordResetIdUsers,updatenewpass,deleteId} = require('../../functions.controller');
const{emailProcessor,getPinByEmailPin,sendAccountDetails} = require('../../../helper/email.helper');
const{getHeader,getAccount}= require('../../../helper/monnify.helper')

exports.userLogin = async(req, res) => {
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
        // check if email exists
        const userRole = req.body.role;
        let user = null;
        if (userRole == 'customer') {
            user = await customerModel.findOne({ email: req.body.email })
            // user1 = await customerModel.findOne({ email: req.body.email }).select('password')
        } else if (userRole == 'vendor') {
            user = await vendorModel.findOne({ email: req.body.email })
            // user1 = await vendorModel.findOne({ email: req.body.email }).select('password')
        }
        const oopsMessage = 'Oops, Your email or password is incorrect'
        if (!user) {
            return res.status(401).json({
                status: false,
                msg: oopsMessage,
                data: null,
                statusCode: 401
            })
        }
        // check if password is correct
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword) {
            return res.status(401).json({
                status: false,
                msg: oopsMessage,
                data: null,
                statusCode: 401
            })
        }
        //assign assess and refresh tokens
        const accessJWT = await createAccessJWT(userRole, user.id)
        //const refreshJWT = await createRefreshJWT(user.email)
        // if (userRole == 'customer') {
        //     const stored =  await storeUserRefreshJWT(user.id, refreshJWT,customerModel)
        // } else if (userRole == 'vendor') {
        //     const stored =  await storeUserRefreshJWT(user.id, refreshJWT,vendorModel)
        // }
        // if (user.role == "vendor"){
        //    return res.status(200).json({
        //         status: true,
        //         msg: 'User logged in succesfully',
        //         data: {
        //             role:user.role,
        //             token:accessJWT
        //         }
        //     });
            
        // }
        res.status(200).json({
            status: true,
            msg: 'User logged in succesfully',
            data: {
                role:user.role,
                token:accessJWT
            }
        });

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

exports.customerRegister = async(req, res) => {
    const { error } = customerRegisterValidation(req.body);
    if (error) {
        if (error) {
            return res.status(400).json({
                status: false,
                msg: error.details[0].message,
                data: null,
                statusCode: 400
            });
        }
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //check if email exists
        const userRole = req.body.role;
        let emailExist = null;
        const opts = {session,new:true};
        if (userRole == 'customer') {
            emailExist = await customerModel.findOne({ email: req.body.email });
        } else {
            res.status(400).json({
                status: false,
                msg: 'User must be a customer',
                statusCode: 400
            })
            return;
        }

        if (emailExist) {
            return res.status(400).json({
                status: false,
                msg: 'This email already exists',
                statusCode: 400
            });
        }
        const header = await getHeader();
        const accountDetails =await getAccount({header:header,accountName:req.body.fullname, accountReference:v4(),
            customerEmail:req.body.email, customerBvn:req.body.bvn, accessToken:header.responseBody.accessToken});
        // console.log(accountDetails);
        
        if(accountDetails.requestSuccessful){
            //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const hashedBvn = await bcrypt.hash(accountDetails.responseBody.bvn, salt);

        //prepare data to save
        const user = new customerModel({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        })

        await user.save(opts);
        // console.log(user);
        const profile= new profileModel({
            userId: user._id,
            fullname: req.body.fullname,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            gender: req.body.gender,
            role: req.body.role
        })

        await profile.save(opts);
        // console.log(profile);
        const account = new accountModel({
            userId: user._id,
            balance:0,
            accountName: accountDetails.responseBody.accountName,
            accountNumber: accountDetails.responseBody.accounts[0].accountNumber,
            referenceNumber: accountDetails.responseBody.accountReference,
            accountBvn: hashedBvn,
            bank: accountDetails.responseBody.accounts[0].bankName,
            reservationReference: accountDetails.responseBody.reservationReference
        })

        await account.save(opts);
        // console.log(account);
        const sendAccount = await sendAccountDetails({accountName:account.accountName,
                                accountNumber:account.accountNumber, bank:account.bank,
                                customerName: req.body.fullname, email: req.body.email});
        await session.commitTransaction();
        session.endSession();
       res.json({
                status: true,
                msg: 'User successfully created',
                data: {
                    id: user._id,
                    fullname: profile.fullname,
                    email: profile.email,
                    mobile: profile.mobileNumber,
                    gender: profile.gender,
                    role: profile.role
                },
                statusCode: 200
            });

        }
    } catch (error) {
        // console.log(error);
        await session.abortTransaction();
        session.endSession()
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.vendorRegister = async(req, res) => {
    const { error } = vendorRegisterValidation(req.body);
    if (error) {
        if (error) {
            return res.status(400).json({
                status: false,
                msg: error.details[0].message,
                data: null,
                statusCode: 400
            });
        }
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //check if email exists
        const userRole = req.body.role;
        let emailExist = null;
        const opts = {session,new:true};
        if (userRole == 'vendor') {
            emailExist = await vendorModel.findOne({ email: req.body.email });
        } else {
            res.status(400).json({
                status: false,
                msg: 'User must be a customer',
                statusCode: 400
            })
            return;
        }

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
        const user = new vendorModel({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        })

        await user.save(opts);

        const profile = new profileModel({
            userId: user._id,
            fullname: req.body.fullname,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            gender: req.body.gender,
            role: req.body.role,
            businessName: req.body.businessName,
            businessNumber: req.body.businessNumber,
            location: req.body.location,
            socials: req.body.socials,
            serviceType: req.body.serviceType,
            vendorPayoutPercentage: 100
        })

        await profile .save(opts);
        const account = new accountModel({
            userId: user._id,
            balance: 0,
        })

        await account.save(opts);
        await session.commitTransaction();
        session.endSession();
        res.json({
            status: true,
            msg: 'User successfully created',
            data: {
                id: user._id,
                fullname: profile .fullname,
                email: profile.email,
                mobile: profile.mobileNumber,
                gender: profile.gender,
                role: profile.role
            },
            statusCode: 200
        })

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession()
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}
exports.resetPassword = async (req,res) =>{
    const { error } = emailValidation(req.body);
    if (error) {
      return res.status(400).json({
            status: false,
            msg: error.details[0].message,
            data: null,
            statusCode: 400
        });
    }
    const { email,role } = req.body;
    if (role == 'vendor'){
     const userData = await vendorModel.findOne({email},(error, data)=>{
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
if(userData && userData._id){
    const nameList = userData.fullname.split(" ")
    const setId = await setPasswordResetIdUsers(email,role)
    if (setId){
    await emailProcessor({email, id:setId.id,name:nameList[0],user: "vendor",type:"request-new-password"})
    return res.status(200).json({
        status: true,
        msg: "Email sent,Check your email.",
        statusCode: 200
    });
    }else{
    return res.status(400).json({
        status : false,
        msg: "unable to send email at the moment, please try again later",
        statusCode:400
    });
}
}
}else{
    const userData = await customerModel.findOne({email},(error, data)=>{
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
if(userData && userData._id){
    const nameList = userData.fullname.split(" ")
    const setId = await setPasswordResetIdUsers(email,role)
    if (setId){
    await emailProcessor({email, email, id:setId.id,name:nameList[0],user: "customer",type:"request-new-password"})
    return res.status(200).json({
        status: true,
        msg: "Email sent,Check your email.",
        statusCode: 200
    });;
    }else{
        return res.status(400).json({
            status : false,
            msg: "unable to send email at the moment, please try again later",
            statusCode:400
        });
}
}
}
res.status(401).json({
    status: false,
    msg: 'This email does not exist',
    statusCode: 401
    });
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
    const {newPassword, id } = req.body
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
        const expiresIn =1*60*60*1000;

        let expDate = dbDate.setDate(dbDate.getDate()+ expiresIn);
        const today = new Date();
        if (today > expDate){
            return res.json({
                status:"error",
                msg:"Invalid or expired link."
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        console.log(getIdData.role)
        if (getIdData.role== 'vendor'){
        const user  = await updatenewpass (getIdData.email,hashedNewPassword,vendorModel);
        const nameList = user.fullname.split(" ")
        if(user._id){
            await emailProcessor({email:user.email, name:nameList[0],type:"password-update-success"})
        //delete pin from db
            await deleteId(user.email, id)
            res.json({status:"success", msg:"Your password has been updated"})
        }
        }else{
        const user  = await updatenewpass (getIdData.email,hashedNewPassword,customerModel);
        const nameList = user.fullname.split(" ")
        if(user._id){
            await emailProcessor({email:user.email,name:nameList[0],type:"password-update-success"})
        //delete pin from db
            await deleteId(user.email, id)
            res.json({status:"success", msg:"Your password has been up dated"})
        }
        }
    }
}catch(error){
    console.log(error);
    res.json({status:"error", msg:"unable to update your password. please try again later"})
}
}