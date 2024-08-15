var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoSchemaV = new Schema({

    
    num:{type:Number, required:true},

   
   
});

module.exports = mongoose.model('InvoNum', invoSchemaV);