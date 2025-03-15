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
    code: {type: String },
    qtyOutMass: {type: Number },
    qtyLeft: {type: Number },
    status: {type: String },
    status2: {type: String },
    status3: {type: String },
    refNumber: {type: String },
    refNumber2: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    crates: {type: Number },
    drums: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchGingerCrush', batchSchemaGW);