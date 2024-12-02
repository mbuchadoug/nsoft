var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var preSchemaV = new Schema({

    barcodeNumber: {type: String },
    pallet: {type: Number },
    barcodes: {type: Number },
    barcodesReceived: {type: Number },
    availableBarcodes: {type: Number },
    palletRcvd: {type: Number },
    palletDispatched: {type: Number },
    palletRemaining: {type: Number }, 
    status: {type: String },
    statusCheck: {type: String },
    statusCheck2: {type: String },
    refNumber: {type: String },
    position: {type: String },
    date: {type: String },
    mformat: {type: String },
    refNumReceive: {type: String },
   
   
   
});

module.exports = mongoose.model('PreRcvd', preSchemaV);