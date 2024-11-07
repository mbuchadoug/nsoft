var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaD = new Schema({

    date: {type: String },
    mformat: {type: String },
    status: {type: String },
    truck: {type: String },
    salesPerson:{type:String},
    salesPersonId:{type:String},
    time: {type: String },
    type: {type: String },
    destination: {type: String },
    warehouse: {type: String },
    product: {type: String },
    dispatcher: {type: String },
    cases: {type: Number },
    aggCases: {type: Number },
    pallets: {type: Number },
    currentPallet: {type: Number },
    remainderCases: {type: Number },
    batchTotalCases:{type:Number},
    batchStatus:{type:String},
    openingStock: {type: Number },
    closingStock: {type: Number },
    month: {type: String },
    year: {type: Number },
    openingBalance: {type: Number},
    closingBalance: {type: Number},
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },
    refNumDispatch:{type:String},
    refNumber:{type:String, required:true},
    position: {type: Number },
    size: {type: Number },
    total: {type: Number },
    breakages: {type: Number },

   
   
});

module.exports = mongoose.model('BatchD', batchSchemaD);