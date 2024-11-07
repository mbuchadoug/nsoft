var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({

    filename: {type: String, },
    fileId: {type: String, },
    month: {type: String},
    status: {type: String},
    status2: {type: String},
    date: {type: String},
    invoiceNumber: {type: Number, },
    year: {type: Number, },
    refNumber: {type: String}
   
});

module.exports = mongoose.model('RepoFiles', repoSchema);