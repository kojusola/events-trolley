const profileModel = require('../../../models/user/profile.model');
const {roleValidation} = require('../../../middlewares/admin/admin.other.validation')

exports.getOneProfile= async(req, res) => {
    try{
        const profile = await profileModel.findOne({"userId":req.query.userId});
        if(profile){
            res.status(200).json({
                status: true,
                msg: 'Profile request successful.',
                data: {
                    profile
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'Profile does not exist.',
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

exports.getAllUsersProfile= async(req, res) => {
    try{
        const {page, perPage} = req.query;
        const options ={
            page: parseInt(page,10) || 1,
            limit: parseInt(perPage,10) || 10
        }
        const Profiles = await profileModel.paginate({},options);
        if(Profiles){
            res.status(200).json({
                status: true,
                msg: 'Profiles request successful.',
                data: {
                    Users:Profiles.docs,
                    page:Profiles.page,
                    pages:Profiles.pages,
                    totalUsers: Profiles.total,
                    limit:Profiles.limit
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'there are no Profiles',
                statusCode: 400
            })
        }
    }catch(error){
        console.log(error)
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}

exports.getUsersProfileByRole = async(req, res) => {
    try{
        const { error } = roleValidation(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                msg: error.details[0].message,
                data: null,
                statusCode: 400
            });
        };
        const {page, perPage} = req.query;
        const options ={
            page: parseInt(page,10) ||1,
            limit: parseInt(perPage,10) ||10
        }
        const Profiles = await profileModel.paginate({"role":req.body.role},options);
        if(Profiles){
            res.status(200).json({
                status: true,
                msg: 'Profiles request successful.',
                data: {
                    Users:Profiles.docs,
                    page:Profiles.page,
                    pages:Profiles.pages,
                    totalUsers: Profiles.total,
                    limit:Profiles.limit
                },
                statusCode: 200
            })
        }else{
            res.status(400).json({
                status: false,
                msg: 'there are no Profiles',
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