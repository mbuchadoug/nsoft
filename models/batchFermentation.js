var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaFermentation = new Schema({

    date: {type: String },
    mformat: {type: String },
    product:{type:String},
    startDate:{type:String},
    status:{type:String},
    days:{type:Number},
    tanks:{type:Number},
    water: {type: Number },
    operator: {type: String },
    checkedBy: {type: String },
    refNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchFermentation', batchSchemaFermentation);