var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoPaymentSchema = new Schema({

    date: {type: String },
    product:{type:String},
    paymentStatus:{type:String},
    amount:{type:Number},
    float:{type:Number},
    remainingBalance:{type:Number},
    batchNumber:{type:String},
    invoiceNumber:{type:Number},
    price: {type: Number },
    total: {type: Number },
    cases: {type: Number },
    units: {type: Number },
    subtotal: {type: Number },
    cumulativeTotal: {type: Number },
    openingStock: {type: Number },
    closingStock: {type: Number },
    closingStockAfterSales: {type: Number },
    closingStockVariance: {type: Number },
    missingUnits: {type: Number },
    missingCases: {type: Number },
    missingBalance: {type: Number },
    customer:{type:String},
    customerMobile:{type:String},
    customerAddress:{type:String},
    customerEmail:{type:String},
    status: {type: String },
    salesPerson: {type: String },
    batchId: {type: String },
    refNumber: {type: String },
    batchNumber: {type: String },
    month: {type: String },
    year: {type: Number },
    totalCases: {type: Number },
    remainingFloat: {type: Number },
    dateValue: {type: Number },
    
    
   
   
});

module.exports = mongoose.model('SalesInvoPayments', invoPaymentSchema);