var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({

    filename: {type: String, required: true},
    fileId: {type: String, required: true},
    month: {type: String},
    status: {type: String},
    date: {type: String},
    year: {type: Number, required: true},
    refNumber: {type: String}
   
});

module.exports = mongoose.model('RepoFiles', repoSchema);