var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaGW = new Schema({

    date: {type: String },
    item:{type:String},
    batchId:{type:String},
    weight:{type:String},
    type:{type:String},
    prefix:{type:String},
    openingMass:{type:Number},
    closingMass:{type:Number},
    newMass:{type:Number},
    totalMass:{type:Number},
    price: {type: Number },
    variance: {type: Number },
   
    status: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
   
    size:{type:Number},
    variance:{type:Number},
    
    
   
   
});

module.exports = mongoose.model('GingerCrush', batchSchemaGW);