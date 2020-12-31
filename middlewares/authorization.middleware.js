const { verifyAccessToken } = require('../createVerifytoken');
const { getJWT } =require('../redis.helper')


 const verifyToken = async function (req,res,next){
     const { authorization } = req.headers;
    const decoded = await verifyAccessToken(authorization);
    if(decoded.email){
        const userId = await getJWT(authorization)
        if(!userId){
           return res.status(403).json({message:"Forbidden"})
        }
         req.userId = await userId
         return  next();
    }
return res.status(403).json({message:"Forbidden"})
}

module.exports={
    verifyToken
}