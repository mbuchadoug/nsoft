var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rawListSchema = new Schema({
  
   item: {type: String},
  status: {type: String},
  type: {type: String},
  stage: {type: String},
   massKgs: {type: Number},
   uniqueMeasure: {type: Number},
   drums: {type: Number},
   crates: {type: Number},
   tanks: {type: Number},
   massTonnes: {type: Number},
   

    

   
});

module.exports = mongoose.model('RawMat', rawListSchema);