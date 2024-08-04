var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaV = new Schema({

    date: {type: String },
    shift: {type: String },
    warehouse: {type: String },
    product: {type: String },
    receiver: {type: String },
    cases: {type: Number },
    refNumber:{type:String, required:true},

   
   
});

module.exports = mongoose.model('BatchR', batchSchemaV);