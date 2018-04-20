/**
 * Created by Academy
 */
var mongoose = require('mongoose');
var Validation = require('../controllers/Validation');
Schema = mongoose.Schema;

//Define your order schema here
var OrderModelSchema = new Schema({
    items:[
    {
        name: String,
        price: Number,
        description: String,
        category: String,
        quantity: Number
    }],
    checkoutDetails: 
    {
        name: {type: String, required: true, validate: Validation.nameValidator},
        address: {
                  line1: {type: String, required: true},
                  country:{type: String, required: true},
                  state:{type: String, required: true},
                  pinCode:{type: String, required: true}
                },
        total: {type: Number},
        date: {type: Date}
    } 
});

// Compile model from schema
module.exports = mongoose.model('Order', OrderModelSchema);