var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoPaymentSchema = new Schema({

    date: {type: String },
    item:{type:String},
    paymentStatus:{type:String},
    amountPaid:{type:Number},
    float:{type:Number},
    remainingBalance:{type:Number},
    voucherNumber:{type:Number},
    batchNumber:{type:String},
    voucherId:{type:String},
    invoiceNumber:{type:Number},
    price: {type: Number },
    total: {type: Number },
    mass: {type: Number },
    subtotal: {type: Number },
    supplier:{type:String},
    status: {type: String },
    batchId: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    remainingFloat: {type: Number },
    dateValue: {type: Number },
    
    
   
   
});

module.exports = mongoose.model('InvoPayments', invoPaymentSchema);