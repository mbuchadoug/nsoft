var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaDB = new Schema({
    product: {type: String },
    batchNumber:{type:String},
    litres: {type: Number },
});

module.exports = mongoose.model('DrainedBatch', batchSchemaDB);