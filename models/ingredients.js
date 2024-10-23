var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientsListSchema = new Schema({
  
   item: {type: String},
   massKgs: {type: Number},
   massTonnes: {type: Number},
   

    

   
});

module.exports = mongoose.model('Ingredients', ingredientsListSchema);