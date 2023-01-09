const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const app = express(); //this is a function that returns an object

const helmet = require('helmet');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

var cors = require('cors'); //
app.use(cors());//cross origin resource sharing - allows us to make requests from one domain to another if we dont use this we will get an error
//app.use(helmet());

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');


const bodyParser = require('body-parser');



const sequelize = require('./util/database');
const User = require('./models/users');
const Expenses = require('./models/expense');
const Order = require('./models/orders');
const ResetToken = require('./models/forgotpasstokens');

const formRoute = require('./routes/form');

const signupRoute = require('./routes/signup');

const purchaseRoute = require('./routes/purchase');

const forgotpassRoute = require('./routes/forgotpassword');
const { HttpRequest } = require('aws-sdk');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan('combined', { stream: accessLogStream }));
app.use(formRoute);
app.use(signupRoute);
app.use(purchaseRoute);
app.use(forgotpassRoute);

app.use(bodyParser.json({ extended: false }));
app.use(express.static(__dirname + '/views'));

User.hasMany(Expenses);
Expenses.belongsTo(User , {
    
    foreignKey: {

        allowNull: false
    },
    constraints: true, onDelete: 'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User , {constraints: true, onDelete: 'CASCADE'});


sequelize.sync().then(result => {//this will create the tables in the database from all the models defined in the sequelize object

    //console.log(result);
    // https.createServer({key: privateKey, cert: certificate}, app)
    // .listen(process.env.PORT || 5000);
    app.listen(process.env.PORT || 5000);

}).catch(err=>console.log(err));