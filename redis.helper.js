// require('dotenv').config();
// const redis = require("redis");
// const client = redis.createClient(process.env.REDIS_URL);

// const setJWT = (key, value)=>{
//     return new Promise((resolve, reject) =>{
//         try{
//             client.set(key,value, (error,res)=>{
//                 if(error) reject (error)
//                 resolve(res);
//             });
//         } catch (error){
//             reject(error);
//         }
//     });
// }
// const getJWT = (key)=>{
//     return new Promise((resolve, reject) =>{
//         try{
//             client.get(key, (error,res)=>{
//                 if(error) reject (error)
//                 resolve(res);
//             });
//         } catch (error){
//             reject(error);
//         }
//     });
// }
// const deleteJWT = (key)=>{
//     try{
//         client.del(key)
//     }catch{
//         console.log(error)
//     }
// }
// module.exports ={
//     setJWT,
//     getJWT,
//     deleteJWT
// }