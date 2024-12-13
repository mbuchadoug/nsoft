var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var disposeSchema = new Schema({
  
   product: {type: String},
   avCases: {type: Number},
   avQuantity: {type: Number},
   quantity: {type: Number},
   type: {type: String},
   date: {type: String},
   month: {type: String},
   year: {type: Number},
    

   
});

module.exports = mongoose.model('Dispose', disposeSchema);