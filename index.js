var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');

function ConfigPlugin () {

    //Setup Database Connection
    var mongoose = require('mongoose');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        //console.log('connected');
    });
    var env = require('./common').config();
    mongoose.connect(env['mongoose_connection']);
    //console.log(env['mongoose_connection']);

    this.merchantLookup = function(internalID, callback){
        Merchant.findOne( {internalID: internalID}, '', callback );
    };
}

module.exports = new ConfigPlugin;