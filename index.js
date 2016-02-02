var Merchant = require('./models/merchant').model;
var mongoose = require('mongoose');
var configPlugin;

function ConfigPlugin (env) {

    //Setup Database Connection
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        //console.log('connected');
    });

    mongoose.connect(env);

    this.merchantLookup = function(internalID, logPlugin, callback){
        if(logPlugin) {
            logPlugin.debug('Merchant Lookup Started');
        }
        Merchant.findOne( {internalID: internalID}, '', callback );
    };



    this.merchantBatchLookup = function(callback) {
        Merchant.find({batchType: "batch"}, {internalID: 1}, {}, callback);
    };

    function checkTime() {

        var d = new Date();
        var hours = d.getHours();
        var mins = d.getMinutes();
        var time = "" + hours + mins;

        logPlugin.debug(time);

        if (time >= 1 && time <= 2359) {
            logPlugin.debug("in the range");
            lookup().merchantBatchLookup(function (err, docs) {
                batchMerchantsArray = docs;
                typeSum(batchMerchantsArray);

    var d = new Date();
    var hours = d.getHours();
    var mins = d.getMinutes();
    var time = "" + hours + mins;

    logPlugin.debug(time);

    Merchant.find({batchType: "batch"}).
        where('batchTime').lt(time).
        exec(callback);


}

function newConfigPlugin (env) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(env); }
    return configPlugin;
}

module.exports = newConfigPlugin;