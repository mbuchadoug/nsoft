var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var refNumDispSchemaV = new Schema({

    
    num:{type:Number, required:true},

   
   
});

module.exports = mongoose.model('refNoSeqDisp', refNumDispSchemaV);