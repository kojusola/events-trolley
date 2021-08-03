const { verifyAccessToken } = require('../createVerifytoken');
//const { getJWT, deleteJWT } =require('../redis.helper')


 const verifyToken = async function (req,res,next){
     const { authorization } = req.headers;
    //  console.log(authorization)
    const decoded = await verifyAccessToken(authorization);
    // console.log(decoded);
    // if(decoded.email){
    //     const userId = await getJWT(authorization)
    //     if(!userId){
    //        return res.status(403).json({message:"Forbidden"})
    //     }
    //      req.userId = await userId
    //      return  next();
    // }
    // deleteJWT( authorization )
    if(decoded.users){
        // console.log(1)
        const userId = await decoded.users
        const userRole = await decoded.role
        req.userRole = await userRole
        req.userId = await userId
        return  next();
     }
    return res.status(403).json({msg:"Forbidden"})
     
}
const restrictTo = (role) => {
    return (req, res, next) => {
        if(!role.includes(req.userRole)){
            return res.status(403).json({msg:"Unauthorized"})
        }
        next()
    }
}

module.exports={
    verifyToken,
    restrictTo
}