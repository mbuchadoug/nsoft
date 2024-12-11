var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warehouseSchema = new Schema({
  
    warehouse: {type: String},
    product: {type:String},
    barcodeNumber:{type:String, },
    name: {type: String,  },
    category: { type: String, },
    subCategory: { type: String, },
    quantity: {type: Number},
    cases: {type: Number},
    unitCases: {type: Number},
    description: {type: String },
    openingQuantity: {type: Number},
    rcvdQuantity: {type: Number},
    quantity: {type: Number},
    photo: {type: String},
    type: {type: String},
    type2: {type: String},
    reason: {type: String},
    account: {type: String},
    size: {type: Number},
    totalReturned: {type: Number},
    totalRepacked: {type: Number},
    rate: {type: Number, },
    zwl: {type: Number, },
    usd: {type: Number},
    rand: {type: Number},
    price3: {type: Number},
    vatPrice: {type: Number },

   
});

module.exports = mongoose.model('Warehouse', warehouseSchema);