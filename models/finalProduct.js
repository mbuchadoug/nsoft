var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finalSchemaCK = new Schema({

    date: {type: String },
    unit: {type: String },
    ingredient:{type:String},
    quantity:{type:Number},
    refNumber: {type: String },
    refNumber2: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    size:{type:Number},
    status: {type: String },

    
    
   
   
});

module.exports = mongoose.model('FinalProduct', finalSchemaCK);