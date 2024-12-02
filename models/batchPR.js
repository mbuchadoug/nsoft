var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaPV = new Schema({

    date: {type: String },
   
    receiver: {type: String },
    barcodes: {type: Number },
    openingBal: {type: Number },
    barcodesRcvd: {type: Number },
    closingBal: {type: Number },
    openingBalX: {type: Number },
   barcodesRcvdX: {type: Number },
    closingBalX: {type: Number },
   
    refNumber:{type:String, required:true},
    mformat: {type: String },
    dateValue: {type: Number },
    pallet: {type: Number },
 
    status: {type: String },
    dispatchDate: {type: String },

    time: {type: String },
    type: {type: String },
   
    /*warehouseDispatch: {type: String },
    dispatcher: {type: String },
    casesBatch: {type: Number },
    casesDispatched: {type: Number },
    refNumDispatch: {type: String },
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },*/
    statsTotalBarcodes: {type: Number },
    statsBarcodesDispatched: {type: Number },
    statsRemainingBarcodes: {type: Number },
    barcodesDispatched: {type: Number },
    fifoPosition: {type: Number },
 

   
   
});

module.exports = mongoose.model('BatchPR', batchSchemaPV);