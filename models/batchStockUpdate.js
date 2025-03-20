var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchStockUpdateSchema = new Schema({
  
   date: {type: String},
   status: {type: String},
   code: {type: String},
   salesPerson: {type: String},
   variance: {type: Number},
   openingStock: {type: Number},
   closingStock: {type: Number},
   sales: {type: Number},
   float: {type: Number},
   month: {type: String},
   year: {type: String},
    

   
});

module.exports = mongoose.model('BatchStockUpdate', batchStockUpdateSchema);