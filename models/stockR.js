var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaR = new Schema({

    barcodeNumber: {type: String },
    date: {type: String },
    name: {type: String, required:true },
    casesRtnd: {type: Number},
    openingBalance: {type: Number},
    closingBalance: {type: Number},
    cases: {type: Number, required: true},
    casesBatch: {type: Number, required: true},
    mformat: {type: String, required: true},
    status: {type: String},
    reason: {type: String},
    salesPerson: {type: String, required: true},
    truck: {type: String, required: true},
    warehouse: {type: String, required: true},
    time: {type: String, required: true},
    availableCases: {type: Number, required: true},
    dateValue: {type: Number, required: true},
    dispatcher: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true},
    category: { type: String, required:true },
    subCategory: { type: String, required:true },
    lot:{type:Number},
    size:{type:Number},
    refNumber:{type:String, required:true},

   
   
});

module.exports = mongoose.model('StockR', schemaR);