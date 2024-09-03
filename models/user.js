const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
 
    role:{type:String,required:true},
    role1:{type:String},
   
    fullname:{type:String,required:true},
    dob:{type:String},
    time:{type:String},
    salesPerson:{type:String},
    truck:{type:String},
    destination:{type:String},
    invoiceNumber:{type:Number},
    rtnsNumber:{type:Number},
    quoteCode:{type:String},
    num:{type:Number},
    cases:{type:Number},
    uid:{type:String, required:true},
    username:{type:String, required:true},
    date:{type:String, required:true},
    shift:{type:String, required:true},
    warehouse:{type:String, required:true},
    product:{type:String, required:true},
    batchId:{type:String},
    currentBatchCount:{type:Number},
    batchCount:{type:Number},
    casesBatch:{type:Number},
    pallets: {type: Number },
    currentPallet: {type: Number },
    remainderCases: {type: Number },
    currentCases:{type:Number},
    lot:{type:Number, required:true},
    refNumber:{type:String},
    year:{type:Number},
    location:{type:String, required:true},
    mformat: {type: String },
    dateValue: {type: String },
    expiryDateValue: {type: String },
    expiryMformat: {type: String },
    expiryDate: {type: String },
    refNumDispatch:{type:String},
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