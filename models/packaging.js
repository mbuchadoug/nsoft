var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var packaging = new Schema({

    date: {type: String },
    mformat: {type: String },
    product:{type:String},
    type:{type:String},
    batchNumber:{type:String},
    refNumber:{type:String},
    time:{type:String},
    shift:{type:String},
    batchId: {type: String },
    volume:{type:Number},
    taste: {type: String },
    label: {type: String },
    month: {type: String },
    tank: {type: Number },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('Packaging', packaging);