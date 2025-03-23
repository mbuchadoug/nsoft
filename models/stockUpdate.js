var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockUpdateSchema = new Schema({
  
   date: {type: String},
   status: {type: String},
   product: {type: String},
   code: {type: String},
   salesPerson: {type: String},
   salesPersonId:{type:String},
   variance: {type: Number},
   price: {type: Number},
   openingStock: {type: Number},
   closingStock: {type: Number},
   sales: {type: Number},
   float: {type: Number},
   month: {type: String},
   year: {type: String},
    

   
});

module.exports = mongoose.model('StockUpdate', stockUpdateSchema);