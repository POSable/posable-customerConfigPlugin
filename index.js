var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');

function ConfigPlugin () {
    mongoose.connect('mongodb://localhost/paymentData');

    this.merchantLookup = function(internalID){
          return Merchant.find({customerID: internalID});
    }
}

module.exports = new ConfigPlugin;