var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vouSchemaV = new Schema({

    
    num:{type:Number, required:true},

   
   
});

module.exports = mongoose.model('VoucherNum', vouSchemaV);