const redis = require("redis");
const dotenv = require('dotenv');
const client = redis.createClient(process.env.REDIS_URL);
dotenv.config();

const setJWT = (key, value)=>{
    return new Promise((resolve, reject) =>{
        try{
            client.set(key,value, (error,res)=>{
                if(error) reject (error)
                resolve(res);
            });
        } catch (error){
            reject(error);
        }
    });
}
const getJWT = (key)=>{
    return new Promise((resolve, reject) =>{
        try{
            client.get(key, (error,res)=>{
                if(error) reject (error)
                resolve(res);
            });
        } catch (error){
            reject(error);
        }
    });
}
module.exports ={
    setJWT,
    getJWT
}