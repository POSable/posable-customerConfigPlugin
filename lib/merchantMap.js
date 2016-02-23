var Merchant = require('../models/merchant').model;

var mapMerchant = function(newMerchantObj, dbLogger) {
    dbLogger.debug('Starting merchant mapping');

    try {
        var merchant = new Merchant();

        merchant.name = newMerchantObj.name;

        return merchant;

    } catch (err) {
        dbLogger.error(err);
        throw err;
    }
};

module.exports = mapMerchant;