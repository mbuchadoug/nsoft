var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaDP = new Schema({


    product: {type: String },
    tanks:{type:Number},
    litres: {type: Number },


       
   
});

module.exports = mongoose.model('DrainedProducts', batchSchemaDP);