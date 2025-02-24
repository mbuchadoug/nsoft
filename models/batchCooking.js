var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaCooking = new Schema({

    date: {type: String },
    mformat: {type: String },
    prefix:{type:String},
    finalProduct:{type:String},
    shift:{type:String},
    nxtStage:{type:String},
    status:{type:String},
    operator: {type: String },
    teamLeader: {type: String },
    quantity: {type: Number },
    checkedBy: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchCooking', batchSchemaCooking);