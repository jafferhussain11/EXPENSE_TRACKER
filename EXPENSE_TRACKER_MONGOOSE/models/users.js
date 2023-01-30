
const mongoose = require('mongoose');

const Schema = mongoose.Schema; //this is a constructor function that returns an object that we can use to create a schema for our model 

const userSchema = new Schema({

    username: {

        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {

        type: String,
        required: true,
        unique: true
    },
    isPremium : {

        type: Boolean,
    }
});

module.exports = mongoose.model('User', userSchema);

