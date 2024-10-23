var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finalSchemaCK = new Schema({

    date: {type: String },
    ingredient:{type:String},
    quantity:{type:Number},
    refNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    size:{type:Number},
    status: {type: String },

    
    
   
   
});

module.exports = mongoose.model('Final Product', finalSchemaCK);