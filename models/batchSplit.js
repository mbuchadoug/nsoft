var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaSplit = new Schema({

    date: {type: String },
    mformat: {type: String },
    status: {type: String },
    truck: {type: String },
    driver: {type: String },
    delivery: {type: String },
    salesPerson:{type:String},
    salesPersonId:{type:String},
    time: {type: String },
    type: {type: String },
    destination: {type: String },
    warehouse: {type: String },
    product: {type: String },
    dispatcher: {type: String },
    cases: {type: Number },
    casesBatch: {type: Number },
    variance: {type: Number },
    aggCases: {type: Number },
    pallet: {type: Number },
    month: {type: String },
    year: {type: Number },
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },
    refNumDispatch:{type:String},
    refNumber:{type:String, required:true},
    batchNumber:{type:String, required:true},
    position: {type: Number },
    size: {type: Number },
    dSize: {type: Number },
    total: {type: Number },
    breakages: {type: Number },

   
   
});

module.exports = mongoose.model('BatchSplit', batchSchemaSplit);