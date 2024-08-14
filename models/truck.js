var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var truckSchema = new Schema({
  
   truckNo: {type: String},
   driver: {type: String},
   make: {type: String},
   weight: {type: String},
    

   
});

module.exports = mongoose.model('Truck', truckSchema);