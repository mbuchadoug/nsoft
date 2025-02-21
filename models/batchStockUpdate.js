var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchStockUpdateSchema = new Schema({
  
   date: {type: String},
   openingStock: {type: Number},
   closingStock: {type: Number},
   sales: {type: Number},
   month: {type: String},
   year: {type: String},
    

   
});

module.exports = mongoose.model('BatchStockUpdate', batchStockUpdateSchema);