var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rmSchema = new Schema({

    filename: {type: String, },
    fileId: {type: String, },
    month: {type: String},
    status: {type: String},
    type: {type: String},
    status2: {type: String},
    date: {type: String},
    grvNumber: {type: Number, },
    year: {type: Number, },
    refNumber: {type: String}
   
});

module.exports = mongoose.model('RMFiles', rmSchema);