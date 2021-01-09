// require('dotenv').config()
// const customerModel = require('../../../models/user/customer.auth.model');
// const vendorModel = require('../../../models/user/vendor.auth.model');
// const {createAccessJWT}= require('../../../createVerifytoken')

// const {verifyRefreshToken}=require('../../../createVerifytoken');
// const { forbidden } = require('@hapi/joi');


//  const usersTokenController = async(req,res,next)=>{
//     const{authorization} = req.headers
//     //make the refresh token valid
//     const decoded = await verifyRefreshToken(authorization)
//      if(decoded.email){
//         const email = decoded.email
//         const iat = decoded.iat
//         await customerModel.exists({email, iat}, async (error, data)=>{
//             if(error){
//              console.log(error);
//              res.status(500).send({
//                  status: false,
//                  msg: 'Can not find data',
//                  data: null,
//                  statusCode: 500
//             })
//          }
//          if(data){
//              const customerData = await customerModel.findOne({email},(error, data)=>{
//                   if(error){
//                       console.log(error);
//                       res.status(500).send({
//                           status: false,
//                           msg: 'Can not find data',
//                           data: null,
//                           statusCode: 500
//                   });
//               }
//           })
//           if(customerData._id) {
//             var tokenExp = customerData.refreshJWT.addedAt;
//             var Dbrefreshtoken = customerData.refreshJWT.token;
//            tokenExp = tokenExp.setDate(tokenExp.getDate()+ +process.env.JWT_REFRESH_SECRET_EXP_DAY)
//            const today = new Date()
//            if (Dbrefreshtoken !== authorization && tokenExp< today){
//                return res.status(403).json({message:"Forbidden"})
//            }
//            // create access token
//            const accessJWT = await createAccessJWT(decoded.email, customerData._id.toString())
//                 return res.json({status:"Success", accessJWT:accessJWT})
//         }
//         }
//           if(!data){
//             const vendorData = await vendorModel.findOne({email},(error, data)=>{
//                  if(error){
//                      console.log(error);
//                      res.status(500).send({
//                          status: false,
//                          msg: 'Can not find data',
//                          data: null,
//                          statusCode: 500
//                  });
//              }
//         });
//         if(vendorData._id) {
//             var tokenExp = new Date(vendorData.refreshJWT.addedAt);
//             var Dbrefreshtoken = vendorData.refreshJWT.token;
//            tokenExp = tokenExp.setDate(tokenExp.getDate()+ +process.env.JWT_REFRESH_SECRET_EXP_DAY)
//            const today = new Date()
//            if (Dbrefreshtoken !== authorization && tokenExp < today){
//                //return res.status(403).json({message:"Forbidden"})
//                console.log(2)
//            }
//             // create access token
//             const accessJWT = await createAccessJWT(decoded.email, vendorData._id.toString())
//             return res.json({status:"Success", accessJWT:accessJWT})
//         }
//         }
// });
// }
//  //res.status(403).json({message:"forbidden"});
// }
// module.exports = {
//     usersTokenController
// }