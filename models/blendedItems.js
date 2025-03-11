var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaBI = new Schema({
    product: {type: String },
    batchNumber:{type:String},
    litres: {type: Number },
    nLitres: {type: Number },
    blendingTank: {type: Number },
    tanks: {type: Number },
    status: {type: String },
    releasedBy: {type: String },
    receivedBy: {type: String },
    refNumber: {type: String },

    date: {type: String },
    month: {type: String },
    year: {type: Number },

});

module.exports = mongoose.model('BlendedItems', batchSchemaBI);