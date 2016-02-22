var redisMerchantKey = 'config_merchant_';
var dbClient = require('./lib/dbClient');
var redisClient = require('./lib/redisClient');
var configLog;


var ConfigPlugin = function (db_ENV, redis_ENV, logPlugin) {

    // Setup configLog and database/redis clients
    setLogger(logPlugin); // <-- Must run BEFORE database/redis clients to set configLog

    dbClient.loggerSetup(configLog);
    dbClient.dbConnect(db_ENV);

    redisClient.loggerSetup(configLog);
    redisClient.redisConnect(redis_ENV);

    // External functions
    this.merchantLookup = function(internalID, external_CB){
        configLog.debug('Merchant lookup started');

        if (redis_ENV) { // <-- Allows plugin to run without Redis
            redisClient.redisLookup(redisMerchantKey + internalID, function(err, res){
                if (err) {
                    // Cannot connect to Redis, search database and update cache
                    configLog.error(err);
                    findMerchant_updateRedis(internalID, external_CB);
                } else if (res === null) {
                    // No record found in Redis, search database and update cache
                    findMerchant_updateRedis(internalID, external_CB);
                } else {
                    // Redis record found and returned
                    return external_CB(null, res);
                }
            });
        } else {
            // No redis client, search database without updating cache
            dbClient.merchantFind(internalID, external_CB);
        }
    };

    this.merchantBatchTrigger = function(callback) {
        Merchant.find({batchType: "batch", batchTime: { $gte: "1229" } }, {internalID: 1}, {}, callback);
    };

    this.merchantBatchLookup = function(callback) {
        Merchant.find({batchType: "batch"}, {internalID: 1}, {}, callback);
    };
};



function findMerchant_updateRedis (internalID, external_CB) {
    dbClient.merchantFind(internalID, function (err, merchant) {
        if (err) {
            // Error connecting to database, exit with error
            configLog.error(err);
            return external_CB(err, null);
        } else {
            // Updates cache but does NOT wait and does NOT handle success/failure
            redisClient.redisUpdate(redisMerchantKey + internalID, merchant);
            // Merchant found in database and returned
            return external_CB(null, merchant);
        }
    });
}


// Setup functions
function setLogger (logPlugin) {
    var defaultLog = {
        info: function(msg) { console.log(msg); },
        debug: function(msg) { console.log(msg); },
        error: function(msg) { console.log(msg); },
        fatal: function(msg) { console.log(msg); } };

    if (logPlugin) { configLog = logPlugin; }
    else { configLog = defaultLog; }
}

function testingStub (testFunctions){
}


module.exports = {
    ConfigPlugin: ConfigPlugin,
    testingStub: testingStub
};