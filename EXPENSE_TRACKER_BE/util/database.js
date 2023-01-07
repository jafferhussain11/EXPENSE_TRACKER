const Sequelize = require('sequelize');


const sequelize = new Sequelize('ExpenseApp', 'root', '', { 

    dialect: 'mysql',
    host : 'localhost',

});

module.exports = sequelize;