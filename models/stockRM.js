var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchemaRM = new Schema({

    date: {type: String },
    address: {type: String },
    regNumber: {type: String },
    item:{type:String},
    batchId:{type:String},
    supplier:{type:String},
    driver: {type: String },
    idNumber: {type: String },
    trailer: {type: Number },
    buckets: {type: Number },
    bags: {type: Number },
    refNumber: {type: String },
    batchNumber: {type: String },
    grvNumber: {type: String },
    voucherNumber: {type: Number },
    mobile: {type: String },
    month: {type: String },
    year: {type: Number },
    lossMargin: {type: Number },
    massAL: {type: Number },
    massALT: {type: Number },
    openingWeightKg: {type: Number },
    openingWeightTonne: {type: Number },
    openingMass: {type: Number },
    newMass: {type: Number },
    closingMass: {type: Number },

    openingMassTonne: {type: Number },
    newMassTonne: {type: Number },
    closingMassTonne: {type: Number },
    dateValue: {type: Number },
    size: {type: Number },
    price: {type: Number },
    subtotal: {type: Number },
    weight: {type: String },
    
   
   
});

module.exports = mongoose.model('StockRM', stockSchemaRM);