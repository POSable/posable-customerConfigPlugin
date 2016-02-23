var Merchant = require('../models/merchant').model;

var mapMerchant = function(newMerchantObj, dbLogger) {
    dbLogger.debug('Starting merchant mapping');

    try {
        var merchant = new Merchant();
        merchant.plugin(autoIncrement.plugin, { model: 'Merchant', field: 'internalID' });

        merchant.name = newMerchantObj.name;
        //merchant.posVenderID = newMerchantObj.posVenderID;
        return merchant;

    } catch (err) {
        dbLogger.error(err);
        throw err;
    }
};

module.exports = mapMerchant;