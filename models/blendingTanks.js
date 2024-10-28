var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaBT = new Schema({


    tankNumber: {type: String },
    litres: {type: Number },
    product: {type: String },
    refNumber: {type: String },
       
   
});

module.exports = mongoose.model('BlendingTanks', batchSchemaBT);