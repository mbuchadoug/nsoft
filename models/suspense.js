var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var suspense = new Schema({
  
   date: {type: String},
   totalBeforeExpenses: {type: Number},
   amount: {type: Number},
   totalAfterExpenses: {type: Number},
   code: {type: String},
   batchId: {type: String},
   salesPerson: {type: String},
   driver: {type: String},
   month: {type: String},
   year: {type: String},
    

   
});

module.exports = mongoose.model('Suspense', suspense);