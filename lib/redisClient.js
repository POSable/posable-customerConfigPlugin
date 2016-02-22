var redis = require('redis');
var client;
var redisLogger;


var RedisClient = function () {

    this.loggerSetup = function (logger) { redisLogger = logger; };  // <-- Required and must run first

    this.redisConnect = function (redis_ENV) {
        if (redis_ENV) {  // <-- Allows plugin to run without Redis
            redisLogger.debug('Connecting to Redis');
            client = redis.createClient({url: redis_ENV});
            client.on('error', function (err) { redisLogger.error(err); });
            client.once('connect', function() { redisLogger.debug('Redis connected'); });
        }
    };

    this.redisLookup = function (key, callback) {
        redisLogger.debug('Searching Redis for key: ' + key);
        client.get(key, function(err, res) {
            if (err) {
                // Cannot connect to Redis, exit with error
                redisLogger.error(err);
                return callback(err, null);
            } else if (res === null) {
                // No record exists in Redis, return null
                redisLogger.debug('Key not found in Redis');
                return callback(null, res);
            } else {
                // Redis record found, return parsed object
                redisLogger.debug('Key: ' + key + ' found in Redis cache');
                var parsedResponse;

                try {
                    parsedResponse = JSON.parse(res);
                } catch (err) {
                    // Error formatting response, exit with error
                    redisLogger.error(err);
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