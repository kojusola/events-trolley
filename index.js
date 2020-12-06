require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');



const app = express();
connectDB();



app.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
})