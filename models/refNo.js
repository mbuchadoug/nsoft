var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var refSchemaV = new Schema({

    date: {type: String },
    type: {type: String },
    product: {type: String },
    item: {type: String },
    refNumber:{type:String, required:true},

   
   
});

module.exports = mongoose.model('refNo', refSchemaV);