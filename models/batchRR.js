var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaRR = new Schema({

    date: {type: String },
    address: {type: String },
    regNumber: {type: String },
    item:{type:String},
    stage:{type:String},
    priceStatus:{type:String},
    voucherNo:{type:Number},
    voucherId:{type:String},
    invoiceNumber:{type:Number},
    openingWeightKg:{type:Number},
    openingWeightTonnes:{type:Number},
    receivedWeightKg:{type:Number},
    closingWeightKg:{type:Number},
    openingWeightTonne:{type:Number},
    receivedWeightTonne:{type:Number},
    closingWeightTonne:{type:Number},
    requestedMassTonnes:{type:Number},
    requestedMassKgs:{type:Number},
    receivedTonnes: {type: Number },
    receivedKgs: {type: Number },
    price: {type: Number },
    total: {type: Number },
    subtotal: {type: Number },
    supplier:{type:String},
    driver: {type: String },
    mobile: {type: String },
    status: {type: String },
    idNumber: {type: String },
    trailer: {type: Number },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
    
   
   
});

module.exports = mongoose.model('BatchRR', batchSchemaRR);