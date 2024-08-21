var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaD = new Schema({

    date: {type: String },
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
    openingStock: {type: Number },
    closingStock: {type: Number },
    month: {type: String },
    year: {type: Number },
    openingBalance: {type: Number},
    closingBalance: {type: Number},
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },
    refNumber:{type:String, required:true},

   
   
});

module.exports = mongoose.model('BatchD', batchSchemaD);