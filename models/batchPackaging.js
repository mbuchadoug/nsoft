var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaPackaging = new Schema({

    date: {type: String },
    mformat: {type: String },
    product:{type:String},
    type:{type:String},
    shift:{type:String},
    code:{type:String},
    refNumber:{type:String},
    batchNumber:{type:String},
    status:{type:String},
    volume:{type:Number},
    tanks:{type:Number},
    taste: {type: String },
    label: {type: String },
    month: {type: String },
    expectedCases: {type: Number },
    totalCases: {type: Number },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchPackaging', batchSchemaPackaging);