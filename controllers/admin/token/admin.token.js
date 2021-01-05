// require('dotenv').config()
// const adminUserModel = require('../../../models/admin/admin.auth.model');
// const {createAccessJWT}= require('../../../createVerifytoken')

// const {verifyRefreshToken}=require('../../../createVerifytoken');
// const { forbidden } = require('@hapi/joi');


//  const adminTokenController = async(req,res,next)=>{
//     const{authorization} = req.headers
//     //make the refresh token valid
//     const decoded = await verifyRefreshToken(authorization)
//     if(decoded.email){
//         const email = decoded.email
//         const admin = await adminUserModel.findOne({email},(error, data)=>{
//             if(error){
//                 console.log(error);
//                 res.status(500).send({
//                     status: false,
//                     msg: 'Can not find data',
//                     data: null,
//                     statusCode: 500
//             })
//         }
//         })
//         if(admin._id) {
//             var tokenExp = admin.refreshJWT.addedAt;
//             var Dbrefreshtoken = admin.refreshJWT.token;
//            tokenExp = tokenExp.setDate(tokenExp.getDate()+ +process.env.JWT_REFRESH_SECRET_EXP_DAY)
//            const today = new Date()
//            if (Dbrefreshtoken !== authorization && tokenExp< today){
//                return res.status(403).json({message:"Forbidden"})
//            }
//            // create access token
//            const accessJWT = await createAccessJWT(decoded.email, admin._id.toString())
//             return res.json({status:"Success", accessJWT:accessJWT})
//         }
//     }
//      return res.status(403).json({message:forbidden});
// }
// module.exports = {
//     adminTokenController
// }