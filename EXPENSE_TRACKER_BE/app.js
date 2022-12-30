const path = require('path');

const express = require('express');
const app = express(); //this is a function that returns an object


var cors = require('cors'); //
app.use(cors());//cross origin resource sharing - allows us to make requests from one domain to another if we dont use this we will get an error



const bodyParser = require('body-parser');



const sequelize = require('./util/database');
const User = require('./models/users');
const Expenses = require('./models/expense');
const Order = require('./models/orders');

const formRoute = require('./routes/form');

const signupRoute = require('./routes/signup');

const purchaseRoute = require('./routes/purchase');


app.use(formRoute);
app.use(signupRoute);
app.use(purchaseRoute);

app.use(bodyParser.json({ extended: false }));
app.use(express.static(__dirname + '/views'));

User.hasMany(Expenses);
Expenses.belongsTo(User , {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);
Order.belongsTo(User , {constraints: true, onDelete: 'CASCADE'});


sequelize.sync().then(result => {//this will create the tables in the database from all the models defined in the sequelize object

    //console.log(result);
    app.listen(5000, () => {
        console.log('server is running');
    });
}).catch(err=>console.log(err));