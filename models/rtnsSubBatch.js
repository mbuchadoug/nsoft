var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rtnSubBatchSchema = new Schema({
   
 
    item: {type: String},
    code: {type: String},
    salesPerson: {type: String},
    salesPersonId:{type:String},
    qty: {type: Number, required: true},
    price: {type: Number, required: true},
    total:{type:Number,required:true},
    balance:{type:Number,},
    rtnsNumber: {type: Number},
    itemId: {type: String},
    date: {type: String},
    month: {type: String, },
    year: {type:Number, },
    status: {type: String, },
    reason: {type: String, },
    type: {type: String,},
    item:{type:String},
    size: {type: Number },
 
  

 
});

module.exports = mongoose.model('ReturnSubBatch', rtnSubBatchSchema);