/**
 * Created by Academy
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

//Define your product schema here
//Attributes to be Created
//Name - name of the menu item
//Category - cuisine to which the menu belongs to
//Description - a short description of the item
//Price - The price of the item
//productImg - filepath to the image
// 
//Use the mongoose-unique-validator plugin to validate for uniqueness
//
var ProductModelSchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    description: String,
    price: String,
    productImg: {fileName: {type: String},filePath: {type: String},fileType: {type: String}}
});

// Apply the uniqueValidator plugin to ProductModelSchema.
ProductModelSchema.plugin(uniqueValidator);

// Compile model from schema
module.exports = mongoose.model('Product', ProductModelSchema);  
