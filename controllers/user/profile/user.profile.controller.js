const customerModel = require('../../../models/user/customer.auth.model');
const vendorModel = require('../../../models/user/vendor.auth.model');
const accountModel = require('../../../models/user/account.model');
const profileModel = require('../../../models/user/profile.model');

exports.userProfile = async(req, res) => {
    const _id = req.userId
    const role = req.userRole
    // if(!_id) return false;
//    var existAsProfile = await customerModel.exists({_id}, async (error, data)=>{
//        if(error){
//         console.log(error);
//         res.status(500).send({
//             status: false,
//             msg: 'Can not find data',
//             data: null,
//             statusCode: 500
//        })
//     }
    // if(data){
//         const customerProfile = await customerModel.findOne({_id},(error, data)=>{
//              if(error){
//                  console.log(error);
//                  res.status(500).send({
//                      status: false,
//                      msg: 'Can not find data',
//                      data: null,
//                      statusCode: 500
//              });
//          }
//      });
//      res.json({success: true,user:customerProfile});
//  }
        //  if(!data){
        //      const vendorProfile = await vendorModel.findOne({_id},(error, data)=>{
        //           if(error){
        //               console.log(error);
        //               res.status(500).send({
        //                   status: false,
        //                   msg: 'Can not find data',
        //                   data: null,
        //                   statusCode: 500
        //           });
        //       }
        //  });
        //  res.json({user: vendorProfile});
        //  }
// });
    try{
        const Profile = await profileModel.findOne({userId:_id});
        const account = await accountModel.findOne({userId:_id});
        if(Profile&& account){
                return res.status(200).json({
                    success: true,
                    user: Profile,
                    userBalance: account.balance
                });
            }
            res.status(500).send({
                status: false,
                msg: 'Can not find data',
                data: null,
                statusCode: 500
            });


    }catch(error){
        res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
            statusCode: 500
        });
    }
}     
