var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaV = new Schema({

    date: {type: String },
    shift: {type: String },
    warehouse: {type: String },
    product: {type: String },
    receiver: {type: String },
    cases: {type: Number },
    openingBal: {type: Number },
    casesRcvd: {type: Number },
    closingBal: {type: Number },
    openingBalX: {type: Number },
    casesRcvdX: {type: Number },
    closingBalX: {type: Number },
    expiryDate: {type: String },
    refNumber:{type:String, required:true},
    mformat: {type: String },
    dateValue: {type: Number },
    expiryDateValue: {type: Number },
    expiryMformat: {type: String },
    status: {type: String },
    dispatchDate: {type: String },
    salesPerson: {type: String },
    time: {type: String },
    type: {type: String },
    /*destination: {type: String },
    warehouseDispatch: {type: String },
    dispatcher: {type: String },
    casesBatch: {type: Number },
    casesDispatched: {type: Number },
    refNumDispatch: {type: String },
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },*/
    statsTotalCases: {type: Number },
    statsCasesDispatched: {type: Number },
    statsRemainingCases: {type: Number },
    casesDispatched: {type: Number },
    fifoPosition: {type: Number },
 

   
   
});

module.exports = mongoose.model('BatchR', batchSchemaV);