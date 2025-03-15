var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rawListSchemaX = new Schema({
  
   item: {type: String},
  status: {type: String},
  type: {type: String},
  code: {type: String},
  refNumber: {type: String},
  batchNumber: {type: String},
  stage: {type: String},
  date: {type: String},
   massKgs: {type: Number},
   uniqueMeasure: {type: Number},
   drums: {type: Number},
   crates: {type: Number},
   tanks: {type: Number},
   unit: {type: String},
   massTonnes: {type: Number},
   

    

   
});

module.exports = mongoose.model('RawMatX', rawListSchemaX);