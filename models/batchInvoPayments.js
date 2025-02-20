var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchInvoPayments = new Schema({

    date: {type: String },
  
    amount:{type:Number},
    remainingAmount: {type: Number },
   
    month: {type: String },

    year: {type: Number },
    dateValue: {type: Number },
    
     
   
});

module.exports = mongoose.model('BatchInvoPayments', batchInvoPayments);