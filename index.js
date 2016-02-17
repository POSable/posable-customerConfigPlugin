var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');
var redis = require('redis');
var redisMerchantKey = 'config_merchant_';
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
            redisLookup(redisMerchantKey + internalID, function(err, res){
                if (err) {
                    configLog.error(err);
                    merchantFind_updateRedis(internalID, external_CB);
                } else if (res === null) {
                    merchantFind_updateRedis(internalID, external_CB);
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
            return external_CB(null, merchant);
        }
    });
}

function merchantFind_updateRedis (internalID, external_CB) {
    configLog.debug('Searching database for merchant with internalID: ' + internalID);
    Merchant.findOne( {internalID: internalID}, '', function(err, merchant) {
        if (err) {
            configLog.error(err);
            return external_CB(err, null);
        } else {
            redisUpdate(redisMerchantKey + internalID, merchant);
            return external_CB(null, merchant);
        }
    })
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
        } else if (res === null) {
            configLog.debug('Key not found in Redis');
            return callback(null, res);
        } else {
            configLog.debug('Key: ' + key + ' found in Redis cache');
            var parsedResponse;

            try {
                parsedResponse = JSON.parse(res); // <-- Formats res into usable JS object
            } catch (err) {
                configLog.error(err);
                return callback(err, null);
            }
            return callback(null, parsedResponse);
        }
    });
}

function redisUpdate (key, value){
    var stringifyValue = JSON.stringify(value);
    client.set(key, stringifyValue, redis.print);
}


// Assigns a default logger if no logger is passed into plugin
function setLogger (logPlugin) {
    var defaultLog = {
        info: function(msg) { console.log(msg); },
        debug: function(msg) { console.log(msg); },
        error: function(msg) { console.log(msg); },
        fatal: function(msg) { console.log(msg); } };

    if (logPlugin) { configLog = logPlugin; }
    else { configLog = defaultLog; }
}

function newConfigPlugin (db_ENV, redis_ENV, logPlugin) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(db_ENV, redis_ENV, logPlugin); }
    return configPlugin;
}

module.exports = newConfigPlugin;