var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({

    filename: {type: String, },
    fileId: {type: String, },
    month: {type: String},
    status: {type: String},
    status2: {type: String},
    date: {type: String},
    type: {type: String},
    item: {type: String},
    num: {type: Number},
    code: {type: String},
    invoiceNumber: {type: Number, },
    idNum: {type: String},
    year: {type: Number, },
    refNumber: {type: String}
   
});

module.exports = mongoose.model('RepoFiles', repoSchema);