var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({

    filename: {type: String, required: true},
    fileId: {type: String, required: true},
    month: {type: String},
    status: {type: String},
    status2: {type: String},
    date: {type: String},
    invoiceNumber: {type: Number, required: true},
    year: {type: Number, required: true},
    refNumber: {type: String}
   
});

module.exports = mongoose.model('RepoFiles', repoSchema);