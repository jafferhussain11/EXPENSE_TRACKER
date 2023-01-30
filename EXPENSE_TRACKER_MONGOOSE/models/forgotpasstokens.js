const mongoose = require('mongoose');

const Schema = mongoose.Schema; //this is a constructor function that returns an object that we can use to create a schema for our model

const userSchema = new Schema({


    usermail: {

        type: String,
        required: true
    },

    token: {

        type: String,
        required: true
    },

    expirationDate: {

        type: Date,
        required: true
    },
    createdAt : { 

        type: Date,
        default: Date.now
    }
  
});

module.exports = mongoose.model('ResetToken', userSchema);