var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warehouseSchema = new Schema({
  
    warehouse: {type: String},
    product: {type:String},
    cases: {type: Number},

   
});

module.exports = mongoose.model('Warehouse', warehouseSchema);