require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log(`Database connected to ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;


//const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/Eventtrolley", {useUnifiedTopology: true, useNewUrlParser:true, useFindAndModify:false}, (err) =>{ 
    //if(!err){
        //console.log("success connecting")
    //}
    //if (err){
        //console.log("Error connecting to database")
    //}
//})