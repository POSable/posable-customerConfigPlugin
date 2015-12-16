var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');

function ConfigPlugin () {

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('connected');
    });

    mongoose.connect('mongodb://localhost/paymentData');

    this.merchantLookup = function(internalID, callback){
        Merchant.findOne( {internalID: internalID}, '', callback );
    };
}

module.exports = new ConfigPlugin;