const mongoose = require('mongoose');

const Schema = mongoose.Schema; //this is a constructor function that returns an object that we can use to create a schema for our model

const orderSchema = new Schema({

    paymentid: {

        type: String,
        
    },
    orderid: {

        type: String,
        required: true
    },
    status: {

        type: String,
        required: true
    },
    userId: {

        type: Schema.Types.ObjectId,
        ref: 'User', // this is the name of the model that we want to relate to similar to foreign key
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);

