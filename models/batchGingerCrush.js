var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaGW = new Schema({

    date: {type: String },
    mformat: {type: String },
    item:{type:String},
    prefix:{type:String},
    type:{type:String},
    nxtStage:{type:String},
    variance: {type: Number },
    qtyInMass: {type: Number },
    qtyOutMass: {type: Number },
    status: {type: String },
    status2: {type: String },
    refNumber: {type: String },
    refNumber2: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchGingerCrush', batchSchemaGW);