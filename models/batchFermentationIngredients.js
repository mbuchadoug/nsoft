var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaFI = new Schema({

    date: {type: String },
    product: {type: String },
    ingredient:{type:String},
    quantity:{type:Number},
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    size:{type:Number},
    water:{type:Number},
    status: {type: String },
    tanks: {type: Number },
       
   
});

module.exports = mongoose.model('BatchFermentationIngredients', batchSchemaFI);