var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    salutation:{type:String, required:true},
    firstName: {type: String, required:true },
    lastName: { type: String, required:true },
    companyName: { type: String, required:true },
    email: {type: String},
    mobile: {type:String},
    mobile2: {type: String},
    address: {type: String },
    town: {type: String},
    city: {type:String},
    country: {type: String},
   
});

module.exports = mongoose.model('Customer', customerSchema);