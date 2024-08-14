var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameSchema = new Schema({
  
   name: {type: String},
    

   
});

module.exports = mongoose.model('Warehouse2', nameSchema);