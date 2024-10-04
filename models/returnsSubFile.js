const mongoose = require('mongoose');


var rtnsSubFileSchema = new mongoose.Schema({


rtnsNumber:{type:String},
item:{type:String, required:true},
qty:{type:Number, required:true},
total:{type:Number, required:true},
month:{type:String},
year:{type:Number,},
date:{type:String, },
subtotal:{type:Number },
salesPerson:{type:String},






})

module.exports = mongoose.model('rtnsSubFile', rtnsSubFileSchema );