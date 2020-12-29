const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const{ getJWT, setJWT }= require('./redis.helper');
const adminUserModel = require('./models/admin/admin.auth.model');
const { findOneAndUpdate } = require('./models/admin/admin.auth.model');
dotenv.config();

const createAccessJWT = async (payload, users) =>{
    try{
        const accessJWT = await jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        await setJWT(accessJWT, users)
        return Promise.resolve (accessJWT);

    }catch(error){
        return Promise.reject (error);
    }
};
const createRefreshJWT =  (payload) =>{
    const refreshJWT = jwt.sign({payload}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:"30d"});
    return Promise.resolve (refreshJWT);
};
const storeUserRefreshJWT = (userId, token, model) =>{
    return new Promise((resolve, reject)=>{
        try{
            model.findByIdAndUpdate(
                {_id: userId},
                {$set:{
                    "refreshJWT.token":token,
                    "refreshJWT.addedAt":Date.now()
                }
            },
            {"new":true}
            )
            .then((data)=>{
                console.log(data)
                resolve(data)})
            .catch((error)=>reject(error))
    }catch(error){
            reject(error);
        }
    })
}


 const verifyToken= function (req,res,next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Assess Denied');
    }
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next()
    } catch (err){
        res.status(400).send('Invalid Token');
    }
}
module.exports = {
    createAccessJWT,
    createRefreshJWT,storeUserRefreshJWT
}