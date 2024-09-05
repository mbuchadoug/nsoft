var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaRR = new Schema({

    date: {type: String },
    address: {type: String },
    regNumber: {type: String },
    item:{type:String},
    supplier:{type:String},
    driver: {type: String },
    mobile: {type: String },
    idNumber: {type: String },
    trailer: {type: Number },
    refNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    
    
   
   
});

module.exports = mongoose.model('BatchRR', batchSchemaRR);