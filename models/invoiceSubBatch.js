var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoiceSubBatchSchema = new Schema({
   
 
    item: {type: String},
     
    code: {type: String},
    qty: {type: Number, required: true},
    price: {type: Number, required: true},
    total:{type:Number,required:true},
    balance:{type:Number,},
    invoiceAmount:{type:Number},
    clientCompany:{type:String},
    clientAddress:{type:String},
    clientName:{type:String},
    invoiceNumber: {type: Number},
    invoiceDescription: {type: String},
    itemId: {type: String},
    date: {type: String},
    month: {type: String, },
    year: {type:Number, },
    status: {type: String, },
    invoiceCode: {type: Number, },
    invoiceId: {type: Number,},
    type: {type: String,},
    item:{type:String},
    salesPerson:{type:String},
    salesPersonId:{type:String},
    subtotal: {type: Number },
    invoiceCodeText: {type: String},
    discount: {type: Number },
    size: {type: Number },
    amountBefore:{type:Number},
  

 
});

module.exports = mongoose.model('InvoiceSubBatch', invoiceSubBatchSchema);