var mongoose = require('mongoose');

var Merchant = require('./models/merchant').model;
//var PosVendor = require('.models/posVendor').model;
//var Integrator = require('.models/integrator').model;


function DB_Client (configLog) { // <-- requires logger

    this.dbConnect = function (db_ENV) {
        var db = mongoose.connection;
        db.on('error', function(err) { configLog.error(err); });
        db.once('open', function ()  { configLog.debug('configPlugin connected to database'); });
        mongoose.connect(db_ENV);
    };

    this.merchantFind = function (internalID, callback) {
        configLog.debug('Searching database for merchant with internalID: ' + internalID);
        Merchant.findOne({internalID: internalID}, '', function (err, merchant) {
            if (err) {
                // Error connecting to database, exit with error
                configLog.error(err);
                return callback(err, null);
            } else {
                // Merchant found in database and returned
                return callback(null, merchant);
            }
        });
    };
}

module.exports = DB_Client;