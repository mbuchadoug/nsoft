var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaGW = new Schema({

    date: {type: String },
    item:{type:String},
    batchId:{type:String},
    weight:{type:String},
    type:{type:String},
    openingBatchWeightKg:{type:Number},
    closingBatchWeightKg:{type:Number},
    openingMass:{type:Number},
    closingMass:{type:Number},
    newMass:{type:Number},
    totalMass:{type:Number},
    price: {type: Number },
    variance: {type: Number },
    subtotal: {type: Number },
    supplier:{type:String},
    mobile: {type: String },
    status: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    address:{type:String},
    trailer:{type:Number},
    regNumber:{type:String},
    driver:{type:String},
    voucherNumber:{type:String},
    size:{type:Number},
    variance:{type:Number},
    
    
   
   
});

module.exports = mongoose.model('GingerWash', batchSchemaGW);