var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');
var redis = require('redis');
var configPlugin;
var client;
var configLog;

function ConfigPlugin (db_ENV, redis_ENV, logPlugin) {

    // Initializes plugin connections and logging object
    setLogger(logPlugin);
    redisConnect(redis_ENV);
    dbConnect(db_ENV);


    this.merchantLookup = function(internalID, external_CB){
        configLog.debug('Merchant lookup started');

        if (redis_ENV) {
            redisLookup(internalID, function(err, res){
                if (err) {
                    configLog.error(err);
                    merchantFind(internalID, external_CB);
                } else if (res === null) {
                    merchantFind(internalID, external_CB);
                } else {
                    return external_CB(null, res);
                }
            });
        } else {
            merchantFind(internalID, external_CB);
        }
    };

    this.merchantBatchTrigger = function(callback) {
        Merchant.find({batchType: "batch", batchTime: { $gte: "1229" } }, {internalID: 1}, {}, callback);
    };

    this.merchantBatchLookup = function(callback) {
        Merchant.find({batchType: "batch"}, {internalID: 1}, {}, callback);
    };

}


// Internal Helper Functions
function merchantFind (internalID, external_CB) {
    configLog.debug('Searching database for merchant with internalID: ' + internalID);
    Merchant.findOne( {internalID: internalID}, '', function(err, merchant) {
        if (err) {
            configLog.error(err);
            return external_CB(err, null);
        } else {
            redisUpdate(internalID, merchant);
            return external_CB(null, merchant);
        }
    });
}

function dbConnect (db_ENV) {
    var db = mongoose.connection;
    db.on('error', function(err) { configLog.error(err); });
    db.once('open', function ()  { configLog.debug('configPlugin connected to database'); });
    mongoose.connect(db_ENV);
}

function redisConnect (redis_ENV) {
    if (redis_ENV) {
        configLog.debug('Connecting to Redis');
        client = redis.createClient({url: redis_ENV});
        client.on('error', function (err) { configLog.error(err); });
        client.once('connect', function() { configLog.debug('Redis connected'); });
    }
}

function redisLookup (key, callback) {
    configLog.debug('Searching Redis for key: ' + key);
    client.get(key, function(err, res) {
        if (err) {
            configLog.error(err);
            return callback(err, null);
        } else {
            configLog.debug('Key: ' + key + ' found in Redis cache');
            return callback(null, res);
        }
    });
}

function redisUpdate (key, value){
    client.set(key, value, redis.print);
}


// Assigns a default logger if no logger is passed into plugin
function setLogger (logPlugin) {
    var defaultLog = {
        info: function(msg) { console.log(msg); },
        debug: function(msg) { console.log(msg); },
        error: function(msg) { console.log('Error: ' + msg); },
        fatal: function(msg) { console.log('Fatal: ' + msg); } };

    if (logPlugin) { configLog = logPlugin; }
    else { configLog = defaultLog; }
}

function newConfigPlugin (db_ENV, redis_ENV, logPlugin) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(db_ENV, redis_ENV, logPlugin); }
    return configPlugin;
}

module.exports = newConfigPlugin;