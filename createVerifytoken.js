require('dotenv').config();
const jwt = require('jsonwebtoken');
//const{ getJWT, setJWT }= require('./redis.helper');
const adminUserModel = require('./models/admin/admin.auth.model');
const { findOneAndUpdate } = require('./models/admin/admin.auth.model');
const { date } = require('@hapi/joi');

const createAccessJWT = async (role, users) =>{
    try{
        console.log(role,users);
        const accessJWT = await jwt.sign({ role,users }, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"60m"});
        //await setJWT(accessJWT, users)
        return Promise.resolve (accessJWT);

    }catch(error){
        return Promise.reject (error);
    }
};
// const createRefreshJWT =  (email) =>{
//     const refreshJWT = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:"30d"});
//     return Promise.resolve (refreshJWT);
// };
// const storeUserRefreshJWT = (userId, token, model) =>{
//     return new Promise((resolve, reject)=>{
//         try{
//             model.findByIdAndUpdate(
//                 {_id: userId},
//                 {$set:{
//                     "refreshJWT.token":token,
//                     "refreshJWT.addedAt":new Date(Date.now())
//                 }
//             },
//             {"new":true}
//             )
//             .then((data)=>{
//                 resolve(data)})
//             .catch((error)=>reject(error))
//     }catch(error){
//             reject(error);
//         }
//     })
// }


 const verifyAccessToken = function (userJWT){
    try{
        return Promise.resolve(jwt.verify(userJWT,  process.env.ACCESS_TOKEN_SECRET));
    } catch (error){
        return Promise.resolve(error);
    }
}
// const verifyRefreshToken = function (userJWT){
//     try{
//         return Promise.resolve(jwt.verify(userJWT,  process.env.REFRESH_TOKEN_SECRET));
//     } catch (error){
//         return Promise.resolve(error);
//     }
// }
module.exports = {
    createAccessJWT,
    verifyAccessToken
}