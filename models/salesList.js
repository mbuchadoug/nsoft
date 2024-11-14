var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salesListSchema = new Schema({
  
   salesPerson: {type: String},
   driver: {type: String},
   

    

   
});

module.exports = mongoose.model('SalesList', salesListSchema);