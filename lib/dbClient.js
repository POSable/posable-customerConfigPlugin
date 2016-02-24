var mongoose = require('mongoose');
var dbLogger;


var merchantMap = require('./merchantMap');


var DB_Client = function () {

    this.loggerSetup = function (logger) { dbLogger = logger; }; // <-- Required and must run first

    this.dbConnect = function (db_ENV) {
        var db = mongoose.connection;
        db.on('error', function(err) { dbLogger.error(err); });
        db.once('open', function ()  { dbLogger.debug('configPlugin connected to database'); });
        mongoose.connect(db_ENV);
    };


};


module.exports = new DB_Client;