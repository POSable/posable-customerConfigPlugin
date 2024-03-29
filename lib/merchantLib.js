var Merchant = require('../models/merchant').model;
var Counter = require('../models/counter').model;
var jwt = require('jsonwebtoken');
var logger;


var MerchantLib = function() {

    this.loggerSetup = function (configLog) { logger = configLog };

    this.merchantFind = function(internalID, callback) {
        logger.debug('Searching database for merchant with internalID: ' + internalID);
        Merchant.findOne({internalID: internalID}, '', function (err, merchant) {
            if (err) {
                // Error connecting to database, exit with error
                logger.error(err);
                return callback(err, null);
            } else {
                // Merchant found in database and returned
                logger.debug('Merchant found');
                return callback(null, merchant);
            }
        });
    };

    this.merchantCreate = function (newMerchantObj, callback) {
        merchantMap(newMerchantObj, function(err, merchant){
            if (err) {
                // Error mapping new merchant, exit with error
                logger.error(err);
                return callback(err, null);
            } else {
                logger.debug('New merchant mapped successfully, saving...');

                merchant.save(function(err, newMerchant) {
                    if (err) {
                        // Error saving new merchant to database, exit with error
                        logger.error(err);
                        return callback(err, null);
                    } else {
                        logger.debug('New merchant saved successfully');
                        return callback(null, newMerchant);
                    }
                });
            }
        });
    };

    this.merchantModify = function (merchant, updateObj, callback) {
        Merchant.update({internalID: merchant.internalID}, updateObj, {new: true}, function(err, updatedMerchant){
            if (err) {
                logger.error(err);
                return callback(err, null);
            } else {
                logger.debug('Merchant updated successfully');
                return callback(null, updatedMerchant);
            }
        });
    };

    this.merchantRemove = function (merchant, callback) {
        Merchant.findOneAndRemove({internalID: merchant.internalID}, function(err, result){
            if (err) {
                logger.error(err);
                return callback(err, null);
            } else {
                logger.debug('Merchant deleted');
                return callback(null, result);
            }
        })
    };

    this.merchantFindOrCreate = function (newMerchantObj, callback) {
        var that = this;

        Merchant.findOne({
            name: newMerchantObj.merchantname,
            storeNumber: newMerchantObj.storenumber,
            posUsername: newMerchantObj.username,
            posPassword: newMerchantObj.password
        }, 'posapiToken', mongooseCallback);

        function mongooseCallback (err, token) {
            if (err) {
                logger.error(err);
            } else if (token === undefined || token === null ) {
                logger.debug('merchant token is undefined or null');
                that.merchantCreate(newMerchantObj, function (err, merchant) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(null, merchant.posapiToken);
                    }
                } )
            } else {
                callback (null, token.posapiToken);
            }
        }
    };

    this.testStub = function (testCounterModel, testMerchantModel, testJWT, testLogger, testMerchantMap, testMerchantCounter) {
        jwt = testJWT;
        logger = testLogger;
        if (testCounterModel) { Counter = testCounterModel; }
        if (testMerchantModel) { Merchant = testMerchantModel; }
        if (testMerchantMap) { merchantMap = testMerchantMap; }
        if (testMerchantCounter) { merchantCounter = testMerchantCounter; }
    };
};

// Internal helper functions

function merchantMap (newMerchantObj, callback) {
    merchantCounter(function(err, newCount){
        if (err) {
            // Error finding/updating merchant counter, exit with error
            return callback(err, null);
        } else {
            // Counter found/updated, continue mapping
            try {
                var merchant = new Merchant();
                merchant.internalID = newCount;
                merchant.name = newMerchantObj.merchantname;
                merchant.contactInfo = newMerchantObj.merchantcontact ? newMerchantObj.merchantcontact || {} : {};
                merchant.storeNumber = newMerchantObj.storenumber ? newMerchantObj.storenumber || "" : "" ;
                merchant.posUsername = newMerchantObj.username ? newMerchantObj.username || "" : "" ;
                merchant.posPassword = newMerchantObj.password ? newMerchantObj.password || "" : "" ;
                merchant.posapiToken = jwt.sign({ name: newMerchantObj.merchantname, internalID: newCount }, 'posable');
                merchant.email = newMerchantObj.email ? newMerchantObj.email || "" : "" ;
                return callback(null, merchant);

            } catch (err) {
                return callback(err, null);
            }
        }
    });
}

function merchantCounter (callback) {
    Counter.findByIdAndUpdate({_id: 'merchants'}, {$inc: {seq: 1}}, function (err, counter) {
        if (err) {
            // Error searching database, exit with error
            return callback(err, null);
        } else {
            // Merchant counter found and updated, return new count
            return callback(null, counter.seq);
        }
    });
}

module.exports = new MerchantLib;