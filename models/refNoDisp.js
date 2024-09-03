var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var refDispSchemaV = new Schema({

    date: {type: String },
    type: {type: String },
    refNumber:{type:String, required:true},
    refNumber2: {type: String },
    cases: {type: Number },
    pallet: {type: Number },


   
   
});

module.exports = mongoose.model('refNoDisp', refDispSchemaV);