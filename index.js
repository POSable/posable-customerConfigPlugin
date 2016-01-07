var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');
var configPlugin;

function ConfigPlugin (env) {

    //Setup Database Connection
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        //console.log('connected');
    });
    //var env = require('./common').config();
    //mongoose.connect(env['mongoose_connection']);
    mongoose.connect(env);
    //console.log(env['mongoose_connection']);

    this.merchantLookup = function(internalID, logPlugin, callback){
        logPlugin.debug('Merchant Lookup Started');
        Merchant.findOne( {internalID: internalID}, '', callback );
    };
}

function newConfigPlugin (env) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(env); }
    return configPlugin;
}

module.exports = newConfigPlugin;