var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaV = new Schema({

    barcodeNumber: {type: String },
    batchId: {type: String },
    dispatchStatus: {type: String },
    date: {type: String },
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
    expiryDate: {type: String },
    mformat: {type: String },
    expiryDateValue: {type: String },
    expiryMformat: {type: String },
    casesDispatched: {type: Number },
    availableCasesDispatch: {type: Number },
    timeOfDispatch: {type: String },
    truck: {type: String },
    mformatDispatch: {type: String },
    salesPerson: {type: String },
    dispatcher: {type: String },
    casesBatch: {type: Number },
    dateValueDispatch: {type: Number},
    refNumDispatch: {type: String },
    size: {type: Number },
    dispatchValue: {type: Number },
    fifoPosition: {type: Number }
 
   
   
});

module.exports = mongoose.model('StockV', schemaV);