const customerModel = require('../../../models/user/customer.auth.model');
const vendorModel = require('../../../models/user/vendor.auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginValidation, customerRegisterValidation, vendorRegisterValidation } = require('../../../middlewares/user/user.auth.validation');

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
        } else if (userRole == 'vendor') {
            user = await vendorModel.findOne({ email: req.body.email })
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
        //assign token
        const token = jwt.sign({
            id: user._id,
            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 72),
        }, process.env.TOKEN_SECRET);

        res.status(200).json({
            status: true,
            msg: 'User logged in succesfully',
            data: {
                fullname: user.fullname,
                email: user.email,
                id: user.id,
                token
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
    try {
        //check if email exists
        const userRole = req.body.role;
        let emailExist = null;

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

        //hash the password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //prepare data to save
        const user = new customerModel({
            fullname: req.body.fullname,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: hashedPassword,
            gender: req.body.gender,
            role: req.body.role
        })

        await user.save();
        res.json({
            status: true,
            msg: 'User successfully created',
            data: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobileNumber,
                gender: user.gender,
                role: user.role
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

    try {
        //check if email exists
        const userRole = req.body.role;
        let emailExist = null;

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
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //prepare data to save
        const user = new vendorModel({
            fullname: req.body.fullname,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            password: hashedPassword,
            gender: req.body.gender,
            role: req.body.role,
            buisnessName: req.body.buisnessName,
            buisnessNumber: req.body.buisnessNumber,
            location: req.body.location,
            socials: req.body.socials,
            serviceType: req.body.serviceType
        })

        await user.save();
        res.json({
            status: true,
            msg: 'User successfully created',
            data: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobileNumber,
                gender: user.gender,
                role: user.role
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