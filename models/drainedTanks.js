var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaDT = new Schema({

    date: {type: String },
    product: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    tanks:{type:Number},
    releasedBy:{type:String},
    receivedBy:{type:String},
       
   
});

module.exports = mongoose.model('DrainedTanks', batchSchemaDT);