var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   
 
   
    bestSeller:{type:Number,required:true},
    bestSellingProduct:{type:Number,required:true},
    bestSellerX:{type:String,required:true},
    bestSellingProductX:{type:String,required:true},

    worstSeller:{type:Number,required:true},
    worstSellingProduct:{type:Number,required:true},
    worstSellerX:{type:String,required:true},
    worstSellingProductX:{type:String,required:true},
    year:{type:Number,required:true},

 
});

module.exports = mongoose.model('SaleStats', schema);