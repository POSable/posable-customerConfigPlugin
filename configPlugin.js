var merchantLib = require('./lib/merchantLib');
var dbClient = require('./lib/dbClient');
var redisClient = require('./lib/redisClient');

var redisMerchantKey = 'config_merchant_';
var configLog;


var ConfigPlugin = function (db_ENV, redis_ENV, logPlugin) {

    // Setup configLog and database/redis clients
    setLogger(logPlugin); // <-- Must run BEFORE database/redis clients to set configLog

    merchantLib.loggerSetup(configLog);

    dbClient.loggerSetup(configLog);
    dbClient.dbConnect(db_ENV);

    redisClient.loggerSetup(configLog);
    redisClient.redisConnect(redis_ENV);


    this.merchantLookup = function (internalID, external_CB) {
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
            merchantLib.merchantFind(internalID, external_CB);
        }
    };

    this.merchantInvoiceConfig = function (internalID, external_CB) {
        this.merchantLookup(internalID, function(err, merchant){
            if (err) {
                configLog.error(err);
                return external_CB(err, null);
            } else {
                // Merchant found, extracting/returning invoiceConfig for merchant
                var merchantInvoice = merchant.invoiceConfig;
                merchantInvoice.internalID = internalID;
                return external_CB(null, merchantInvoice);
            }
        });
    };

    this.merchantSave = function (newMerchantObj, external_CB) {
        merchantLib.merchantCreate(newMerchantObj, external_CB);
    };

    this.merchantUpdate = function (origMerchant, updateObj, external_CB) {
        merchantLib.merchantModify(origMerchant, updateObj, external_CB);
    };

    this.merchantDelete = function (merchant, external_CB) {
        merchantLib.merchantRemove(merchant, external_CB);
    };

    this.getToken = function (newMerchantObj, external_CB) {
        merchantLib.merchantFindOrCreate(newMerchantObj, external_CB);
    }
};

function findMerchant_updateRedis (internalID, external_CB) {
    merchantLib.merchantFind(internalID, function (err, merchant) {
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