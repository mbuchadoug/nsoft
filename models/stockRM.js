var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchemaRM = new Schema({

    date: {type: String },
    address: {type: String },
    regNumber: {type: String },
    item:{type:String},
    supplier:{type:String},
    driver: {type: String },
    idNumber: {type: String },
    trailer: {type: Number },
    refNumber: {type: String },
    mobile: {type: String },
    month: {type: String },
    year: {type: Number },
    openingMass: {type: Number },
    newMass: {type: Number },
    closingMass: {type: Number },
    dateValue: {type: Number },
    size: {type: Number },
    price: {type: Number },
    subtotal: {type: Number },
    weight: {type: String },
    
   
   
});

module.exports = mongoose.model('StockRM', stockSchemaRM);