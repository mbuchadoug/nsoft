var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaGW = new Schema({

    date: {type: String },
    mformat: {type: String },
    item:{type:String},
    prefix:{type:String},
    nxtStage:{type:String},
    variance: {type: Number },
    crates: {type: Number },
    qtyInMass: {type: Number },
    qtyOutMass: {type: Number },
    status: {type: String },
    status2: {type: String },
    status3: {type: String },
    code: {type: String },
    refNumber: {type: String },
    refNumber2: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    type: {type: String },
    remainingTonnes:{type:Number},
    remainingKgs:{type:Number},
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchGingerWash', batchSchemaGW);