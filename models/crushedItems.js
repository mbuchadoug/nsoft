var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batchSchemaCI = new Schema({


    item: {type: String },
    massKgs:{type:Number},
    crates:{type:Number},
    uniqueMeasure:{type:Number},
    massTonnes: {type: Number },


       
   
});

module.exports = mongoose.model('CrushedItems', batchSchemaCI);