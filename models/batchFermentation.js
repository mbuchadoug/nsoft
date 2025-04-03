var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaFermentation = new Schema({

    date: {type: String },
    mformat: {type: String },
    product:{type:String},
    nxtStage:{type:String},
    startDate:{type:String},
    status:{type:String},
    days:{type:Number},
    tanks:{type:Number},
    prefix:{type:String},
    tanksDrained:{type:Number},
    blendingTanks:{type:Number},
    blendingTanksDrained:{type:Number},
    blendingVolumeDrained:{type:Number},
    volumeDrained:{type:Number},
    casesPackaged:{type:Number},
    casesDispatched:{type:Number},
    casesRemaining:{type:Number},
    water: {type: Number },
    operator: {type: String },
    checkedBy: {type: String },
    batchNumber: {type: String },
    code: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchFermentation', batchSchemaFermentation);