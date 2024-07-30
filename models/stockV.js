var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaV = new Schema({

    barcodeNumber: {type: String },
    name: {type: String, required:true },
    casesReceived: {type: Number, required: true},
    cases: {type: Number, required: true},
    mformat: {type: String, required: true},
    status: {type: String, required: true},
    warehouse: {type: String, required: true},
    shift: {type: String, required: true},
    availableCases: {type: Number, required: true},
    dateValue: {type: Number, required: true},
    receiver: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true},
    category: { type: String, required:true },
    subCategory: { type: String, required:true },
    lot:{type:Number},
    refNumber:{type:String, required:true},
    location:{type:String},
   
   
});

module.exports = mongoose.model('StockV', schemaV);