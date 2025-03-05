var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaCK = new Schema({

    date: {type: String },
    ingredient:{type:String},
    quantity:{type:Number},
    potNumber:{type:Number},
    time:{type:String},
    finishTime:{type:String},
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    size:{type:Number},
    unit:{type:String},
    operator:{type:String},
    teamLeader:{type:String},
    finalProduct:{type:String},
    
    
   
   
});

module.exports = mongoose.model('Cooking', batchSchemaCK);