var ConfigPlugin = require('configPlugin').ConfigPlugin;
var configPlugin;

function setConfigPlugin (db_ENV, redis_ENV, logPlugin) {
    if (!configPlugin) { configPlugin = new ConfigPlugin(db_ENV, redis_ENV, logPlugin); }
    return configPlugin;
}


module.exports = setConfigPlugin;
