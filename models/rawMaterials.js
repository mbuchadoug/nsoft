var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rawListSchema = new Schema({
  
   item: {type: String},
   massKgs: {type: Number},
   massTonnes: {type: Number},
   

    

   
});

module.exports = mongoose.model('RM List', rawListSchema);