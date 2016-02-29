var mongoose = require('mongoose');
var logger;
var db = mongoose.connection;


var DB_Client = function () {

    this.loggerSetup = function (configLog) { logger = configLog };

    this.dbConnect = function (db_ENV) {
        mongoose.connect(db_ENV);
        db.on('error', function(err) { logger.error(err); });
        db.once('open', function ()  { logger.debug('configPlugin connected to database'); });
    };

    this.testStub = function (testMongoose) {
        mongoose = testMongoose;
    };
};


module.exports = new DB_Client;