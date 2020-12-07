require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
connectDB();

//declare routes
const adminAuth = require('./routes/auth/admin.auth.route');
const userAuth = require('./routes/auth/user.auth.route')

//use routes
app.use('/admin', adminAuth);
app.use('/auth', userAuth);

// test working app
app.get('/', (req, res) => {
    res.send('this app works')
})


app.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
})