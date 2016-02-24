var mongoose = require('mongoose');
var logger;


var DB_Client = function () {

    this.loggerSetup = function(configLog) { logger = configLog };

    this.dbConnect = function (db_ENV) {
        var db = mongoose.connection;
        db.on('error', function(err) { logger.error(err); });
        db.once('open', function ()  { logger.debug('configPlugin connected to database'); });
        mongoose.connect(db_ENV);
    };
};


module.exports = new DB_Client;