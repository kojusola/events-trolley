const adminUserModel = require('../../../models/admin/admin.auth.model');

exports.adminProfile = async(req, res) => {
    const _id = req.userId
    if(!_id) return false;
  const adminPage = await adminUserModel.findOne({_id},(error, data)=>{
        if(error){
            console.log(error);
            res.status(500).send({
                status: false,
                msg: 'Can not find data',
                data: null,
                statusCode: 500
        })
    }
    })
    res.json({admin:adminPage});
}