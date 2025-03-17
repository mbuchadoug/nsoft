var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaBD = new Schema({
    product: {type: String },
    colour:{type:String},
    odour:{type:String},
    date:{type:String},
    day:{type:Number},
    pos:{type:Number},
    mouthfeel:{type:String},
    taste:{type:String},
    tankNumber:{type:Number},
    num:{type:Number},
    afterTaste:{type:String},
    status: {type: String },
    reason: {type: String },
    qualityAssurance: {type: String },
    supervisor: {type: String },
    md: {type: String },
    operator: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    batchId: {type: String },
    date: {type: String },
    month: {type: String },
    year: {type: Number },

});

module.exports = mongoose.model('BlendingDays', batchSchemaBD);