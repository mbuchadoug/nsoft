var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockVoucher = new Schema({

    name: {type: String },
    description: {type: String },
    userId: {type: String },
    dept: {type: String },
    item:{type:String},
    status:{type:String},
    status1: {type: String },
    status2: {type: String },
    status3: {type: String },
    status4: {type: String },
    approver1: {type: String },
    date1:{type:String},
    approver2: {type: String },
    date2:{type:String},
    approver3: {type: String },
    date3:{type:String},
    month: {type: String },
    year: {type: Number },
    dateValue: {type: Number },
    currentMassTonnes:{type:Number},
    currentMassKgs:{type:Number},
    requestedMass:{type:Number},
    requestedMassTonnes:{type:Number},
    requestedMassKgs:{type:Number},
    date:{type:String},
    unit:{type:String},
    voucherNumber:{type:Number},
   
    
   
   
});

module.exports = mongoose.model('Stock Voucher', stockVoucher);