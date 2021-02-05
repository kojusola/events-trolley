require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require("express-fileupload")
const port = process.env.PORT || 3000;

// API Security
// app.use(helmet());

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
connectDB();

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

//declare routes
const adminAuth = require('./routes/auth/admin.auth.route');
const userAuth = require('./routes/auth/user.auth.route');
const adminProfile = require('./routes/profile/admin.profile.route');
const userProfile = require('./routes/profile/user.profile.route');
const ticket = require('./routes/ticket.route');
//const tokens = require('./routes/token.route');

//use routes
// log in
app.use('/admin', adminAuth);
app.use('/auth', userAuth);
//  profile
app.use('/profile/admin', adminProfile);
app.use('/profile/user', userProfile);
// tokens
//app.use('/tokens', tokens);
//ticket
app.use('/ticket', ticket);



// test working app
app.get('/', (req, res) => {
    res.send('this app works')
})


app.listen(port, () => {
    console.log('server is running');
});