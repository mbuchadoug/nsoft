var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoPaymentSchema = new Schema({

    date: {type: String },
    item:{type:String},
    status:{type:String},
    supplier:{type:String},
    amountPaid:{type:Number},
    float:{type:Number},
    batchNumber:{type:String},
    invoiceNumber:{type:Number},
    voucherNumber: {type: Number },
    refNumber: {type: String },
    batchId: {type: String },
    refNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    mass: {type: Number },
    remainingBalance: {type: Number },
    remainingFloat: {type: Number },
    
    
   
   
});

module.exports = mongoose.model('InvoPayments', invoPaymentSchema);