const adminUserModel = require('../../../models/admin/admin.auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation } = require('../../../middlewares/admin/admin.auth.validation');

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
        const token = jwt.sign({
            id: admin._id,
            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        }, process.env.TOKEN_SECRET)

        res.status(200).json({
            status: true,
            msg: 'Admin logged in succesfully',
            data: {
                fullname: admin.fullname,
                email: admin.email,
                id: admin.id,
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
        const salt = await bcrypt.genSalt(8);
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
                id: admin._id,
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