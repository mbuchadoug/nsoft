var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaF = new Schema({

    date: {type: String },
    product: {type: String },
    ingredient:{type:String},
    quantity:{type:Number},
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    size:{type:Number},
    water:{type:Number},
    startDate: {type: String },
    endDate: {type: String },
    tanks: {type: Number },
    approvedBy: {type: String },
       
   
});

module.exports = mongoose.model('Fermentation', batchSchemaF);