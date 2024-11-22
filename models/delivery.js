var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaDelivery = new Schema({

    date: {type: String },
    mformat: {type: String },
    status: {type: String },
    truck: {type: String },
    driver: {type: String },
    delivery: {type: String },
    branch:{type:String},
    time: {type: String },
    type: {type: String },
    destination: {type: String }, 
    product: {type: String },
    dispatcher: {type: String },
    cases: {type: Number },
    casesReceived: {type: Number },
    variance: {type: Number },
    month: {type: String },
    year: {type: Number },
    dispatchMformat: {type: String },
    dateValueDispatch: {type: Number },
    refNumDispatch:{type:String},
    size: {type: Number },


   
   
});

module.exports = mongoose.model('Delivery', schemaDelivery);