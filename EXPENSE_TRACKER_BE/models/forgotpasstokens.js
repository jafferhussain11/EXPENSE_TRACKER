const Sequelize = require('sequelize');

const sequelize = require('../util/database');
// Define the ResetToken model
const ResetToken = sequelize.define('reset_token', {
 
    Id : {

        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    usermail: {

        type: Sequelize.STRING,
        allowNull: false,
    
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expirationDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = ResetToken;
