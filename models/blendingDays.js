var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaBD = new Schema({
    product: {type: String },
    colour:{type:String},
    mouthfeel:{type:String},
    taste:{type:String},
    afterTaste:{type:String},
    status: {type: String },
    reason: {type: String },
    qualityAssurance: {type: String },
    supervisor: {type: String },
    md: {type: String },
    status: {type: String },
    date: {type: String },
    month: {type: String },
    year: {type: Number },

});

module.exports = mongoose.model('BlendingDays', batchSchemaBD);