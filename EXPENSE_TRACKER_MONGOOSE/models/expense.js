const mongoose = require('mongoose');

const Schema = mongoose.Schema; //this is a constructor function that returns an object that we can use to create a schema for our model

const expenseSchema = new Schema({

    expenseval: {

        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {

        type: String,
        required: true
    },

    userId: {

        type: Schema.Types.ObjectId,
        ref: 'User', // this is the name of the model that we want to relate to similar to foreign key
        required: true
    },
    createdAt : {

        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', expenseSchema);




