const mongoose = require('mongoose');


var invoiceSubFileSchema = new mongoose.Schema({


invoiceId:{type:String},
invoCode:{type:String},
invoiceCode:{type:String},

code:{type:String},
filename:{type:String},

item:{type:String, required:true},
qty:{type:Number, required:true},
price:{type:Number, required:true},
total:{type:Number, required:true},
month:{type:String},
description:{type:String,},
year:{type:Number,},
date:{type:String, },

invoiceNumber:{type:Number },
subtotal:{type:Number },
salesPerson:{type:String},
salesPersonId:{type:String},
clientCompany:{type:String},
clientAddress:{type:String},
clientName:{type:String},





})

module.exports = mongoose.model('invoiceSubFile', invoiceSubFileSchema );