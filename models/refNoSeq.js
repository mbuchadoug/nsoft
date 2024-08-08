var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var refNumSchemaV = new Schema({

    
    num:{type:Number, required:true},

   
   
});

module.exports = mongoose.model('refNoSeq', refNumSchemaV);