var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchCashRemitt = new Schema({
  
   date: {type: String},
   amount: {type: Number},
   batchNumber: {type: String},
   code: {type: String},
   batchId: {type: String},
   month: {type: String},
   year: {type: String},
    

   
});

module.exports = mongoose.model('BatchCashRemitt', batchCashRemitt);