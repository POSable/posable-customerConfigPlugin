var redis = require('redis');
var client;
var logger;


var RedisClient = function () {

    this.loggerSetup = function (configLog) { logger = configLog; };  // <-- requires logger

    this.redisConnect = function (redis_ENV) {
        if (redis_ENV) {  // <-- Allows plugin to run without Redis
            logger.debug('Connecting to Redis');
            client = redis.createClient({url: redis_ENV});
            client.on('error', function (err) { logger.error(err); });
            client.once('connect', function() { logger.debug('Redis connected'); });
        }
    };

    this.redisLookup = function (key, callback) {
        logger.debug('Searching Redis for key: ' + key);
        client.get(key, function(err, res) {
            if (err) {
                // Cannot connect to Redis, exit with error
                logger.error(err);
                return callback(err, null);
            } else if (res === null) {
                // No record exists in Redis, return null
                logger.debug('Key not found in Redis');
                return callback(null, res);
            } else {
                // Redis record found, return parsed object
                logger.debug('Key: ' + key + ' found in Redis cache');
                var parsedResponse;

                try {
                    parsedResponse = JSON.parse(res);
                } catch (err) {
                    // Error formatting response, exit with error
                    logger.error(err);
                    return callback(err, null);
                }
                return callback(null, parsedResponse);
            }
        });
    };

    this.redisUpdate = function (key, value) {
        var stringifyValue = JSON.stringify(value);
        client.set(key, stringifyValue, redis.print);
    }
};

module.exports = new RedisClient;