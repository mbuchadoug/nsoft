var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    barcodeNumber:{type:String, required:true},
    name: {type: String, required:true },
    category: { type: String, required:true },
    subCategory: { type: String, required:true },
    quantity: {type: Number},
    cases: {type: Number},
    unitCases: {type: Number},
    description: {type: String },
    openingQuantity: {type: Number},
    rcvdQuantity: {type: Number},
    quantity: {type: Number},
    photo: {type: String},
    type: {type: String},
    account: {type: String},
    size: {type: Number},
    rate: {type: Number, },
    zwl: {type: Number, },
    usd: {type: Number},
    rand: {type: Number},
    price3: {type: Number},
    vatPrice: {type: Number },
});

module.exports = mongoose.model('Product', schema);