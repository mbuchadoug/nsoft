var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchemaRMFile = new Schema({

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
    dateValue: {type: Number },
    size: {type: Number },
    price: {type: Number },
    subtotal: {type: Number },
    openingWeight:{type:Number},
    closingWeight:{type:Number},
    weight: {type: Number },
    openingWeightTonne:{type:Number},
    closingWeightTonne:{type:Number},
    weightTonne: {type: Number },
    
   
   
});

module.exports = mongoose.model('StockRMFile', stockSchemaRMFile);