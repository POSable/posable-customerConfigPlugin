var Merchant = require('../models/merchant').model;
var Counter = require('../models/merchant').model;
var jwt = require('jsonwebtoken');


var MerchantLib = function(logger) {

    this.merchantFind = function(internalID, callback) {
        logger.debug('Searching database for merchant with internalID: ' + internalID);
        Merchant.findOne({internalID: internalID}, '', function (err, merchant) {
            if (err) {
                // Error connecting to database, exit with error
                logger.error(err);
                return callback(err, null);
            } else {
                // Merchant found in database and returned
                return callback(null, merchant);
            }
        });
    };

    this.merchantCreate = function(newMerchantObj, callback) {

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

    //this.merchantModify = function(merchant, callback) {
    //    Merchant.findByIdAndUpdate({internalID: merchant.internalID })
    //};
    //
    //this.merchantRemove = function(merchant, callback) {
    //
    //};
};


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
                merchant.name = newMerchantObj.name;
                //.... more assignments here

                merchant.posapiToken = jwt.sign({ name: merchant.name, internalID: merchant.internalID });

                return callback(null, merchant);

            } catch (err) {
                console.log(err);
                return callback(err, null);
            }
        }
    });
}

function merchantCounter (callback) {
    Counter.findByIdAndUpdate({_id: 'merchants'}, {$inc: {seq: 1}}, {new: true}, function (err, counter) {
        if (err) {
            // Error searching database, exit with error
            return callback(err, null);
        } else {
            // Merchant counter found and updated, return new count
            console.log('counter: ' + counter.seq);
            return callback(null, counter.seq);
        }
    });
}


module.exports = new MerchantLib;