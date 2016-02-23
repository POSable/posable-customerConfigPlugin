var mongoose = require('mongoose');
var dbLogger;

var Merchant = require('../models/merchant').model;
var counter = require('../models/merchant').model;
var merchantMap = require('./merchantMap');


var DB_Client = function () {

    this.loggerSetup = function (logger) { dbLogger = logger; }; // <-- Required and must run first

    this.dbConnect = function (db_ENV) {
        var db = mongoose.connection;
        db.on('error', function(err) { dbLogger.error(err); });
        db.once('open', function ()  { dbLogger.debug('configPlugin connected to database'); });
        var connection = mongoose.connect(db_ENV);

        autoIncrement.initialize(connection);
    };

    this.merchantFind = function (internalID, callback) {
        dbLogger.debug('Searching database for merchant with internalID: ' + internalID);
        Merchant.findOne({internalID: internalID}, '', function (err, merchant) {
            if (err) {
                // Error connecting to database, exit with error
                dbLogger.error(err);
                return callback(err, null);
            } else {
                // Merchant found in database and returned
                return callback(null, merchant);
            }
        });
    };

    this.merchantCreate = function (newMerchantObj, callback) {
        var newMerchant = merchantMap(newMerchantObj, dbLogger);
        newMerchant.pre('save', function(next) {
            counter.findByIdAndUpdate( {_id: 'merchants'}, {$inc: {seq: 1} }, function(err, counter) {
                if(err)
                    return callback(err, null);
                newMerchant.internalID = counter.seq;
                next();
            });
        });
    }
};


module.exports = new DB_Client;