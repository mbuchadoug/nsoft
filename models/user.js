const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
 
    role:{type:String,required:true},
    role1:{type:String},
    dept:{type:String},
    dispatchDate:{type:String},
    url:{type:String},
    endDate:{type:String},
    refNo:{type:String},
    prRefNumber:{type:String},
    fullname:{type:String,required:true},
    dob:{type:String},
    time:{type:String},
    branch:{type:String},
    salesPerson:{type:String},
    truck:{type:String},
    driver:{type:String},
    destination:{type:String},
    invoiceNumber:{type:Number},
    rtnsNumber:{type:Number},
    quoteCode:{type:String},
    casesBatchR: {type: Number },
    num:{type:Number},
    batchTotalCases:{type:Number},
    cases:{type:Number},
    countSize:{type:Number},
    refNumReceive: {type: String },
    uid:{type:String, required:true},
    username:{type:String, required:true},
    date:{type:String, required:true},
    shift:{type:String, required:true},
    reason:{type:String},
    warehouse:{type:String, required:true},
    product:{type:String, required:true},
    batchId:{type:String},
    grvNumber:{type:String},
    batchNumber:{type:String},
    currentBatchCount:{type:Number},
    batchCount:{type:Number},
    openingBal:{type:Number},
    casesBatch:{type:Number},
    batchPallets:{type:Number},
    palletCount:{type:Number},
    palletCasesBatch:{type:Number},
    batchRCases:{type:Number},
    pallets: {type: Number },
    palletNum: {type: Number },
    aggCases: {type: Number },
    currentPallet: {type: Number },
    remainderCases: {type: Number },
    currentCases:{type:Number},
    amount:{type:Number},
    currentRemainingCases:{type:Number},
    lot:{type:Number, required:true},
    prPallet: {type: Number },
    countPallet: {type: Number },
    refNumber:{type:String},
    year:{type:Number},
    voucherNumber:{type:Number},
    location:{type:String, required:true},
    mformat: {type: String },
    item: {type: String },
    supplier: {type: String },
    availableMass: {type: Number },
    invoiceNumber: {type: Number },
    product: {type: String },
    dateValue: {type: String },
    expiryDateValue: {type: String },
    expiryMformat: {type: String },
    expiryDate: {type: String },
    refNumDispatch:{type:String},
    balance: {type: Number },
    casesSold: {type: Number },
    uid: {type: String },
    address: {type: String },
    mobile: {type: String },
    region: {type: String },
    photo: {type: String },
    password: {type: String, required: true}
   
});

// Custom validation for email
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
  };
  
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);  
  };

module.exports = mongoose.model('User', userSchema);