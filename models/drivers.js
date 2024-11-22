var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var driversListSchema = new Schema({
  
   driver: {type: String},


    

   
});

module.exports = mongoose.model('DriversList', driversListSchema);