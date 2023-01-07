const Sequelize = require('sequelize');


const sequelize = new Sequelize('ExpenseApp', 'root', 'Maria123#', { 

    dialect: 'mysql',
    host : 'localhost',

});

module.exports = sequelize;