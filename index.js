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

    mongoose.connect(env);

    this.merchantLookup = function(internalID, logPlugin, callback){
        if(logPlugin) {
            logPlugin.debug('Merchant Lookup Started');
        }
        Merchant.findOne( {internalID: internalID}, '', callback );
    };

    this.merchantBatchTrigger = function(callback) {
        Merchant.find({batchType: "batch", batchTime: { $gte: 1229} }, {internalID: 1}, {}, callback);
    };

    this.merchantBatchLookup = function(callback) {
        Merchant.find({batchType: "batch"}, {internalID: 1}, {}, callback);
    };

}

function newConfigPlugin (env) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(env); }
    return configPlugin;
}

module.exports = newConfigPlugin;