var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    product: {type: String, required:true },
   
    openingBal: {type: Number, required: true},
    holdingCases: {type: Number, required: true},
    date: {type: String},
    casesReceived: {type: Number},
    updateDate: {type: String},
    salesPerson: {type: String},
   
    mformat: {type: String},
    year: {type: Number},
    month: {type: String},
    stockUpdate: {type: String},
    dateValue: {type: Number},
    updateDateValue: {type: Number},
   
    rate: {type: Number},
    zwl: {type: Number},
    price: {type: Number},
});

module.exports = mongoose.model('Sales Stock', schema);