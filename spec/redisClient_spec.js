var testRedisClient = require('../lib/redisClient');
var testRedis;
var testClient;
var testClientReturn;
var testCB = function(arg1, arg2){return {err: arg1, res: arg2}};
var testLogger;


describe('redisClient', function(){

    beforeEach(function(){
        var testRes = 'foundRecord';
        testClientReturn = {on: function(){}, once: function(){}};
        testRedis = {createClient: function(){return testClientReturn}};
        testClient = {get: function(key, callback){return callback(null, testRes)}, set: function(){}};
        testLogger = {debug: function(){}, error: function(){}};

        testRedisClient.testStub(testRedis, testClient, testLogger);

        spyOn(testClient, 'get').and.callThrough();
        spyOn(testClient, 'set');
        spyOn(testLogger, 'debug');
        spyOn(testLogger, 'error');
        spyOn(testRedis, 'createClient').and.callThrough();
    });

    it('connect to the Redis server', function(){
        testRedisClient.redisConnect('testRedis_ENV');
        expect(testRedis.createClient).toHaveBeenCalledWith({url: 'testRedis_ENV'});
    });

    describe('can access the Redis records', function(){
        it('and return a parsed record when one is found', function(){
            testRedisClient.redisLookup('testKey', testCB);
            expect(testClient.get).toHaveBeenCalled();
            expect(testLogger.debug).toHaveBeenCalled();
        });

        it('can update Redis records', function(){
            testRedisClient.redisUpdate();
            expect(testClient.set).toHaveBeenCalled();
        });
    });

    describe('returns and logs errors', function(){
        beforeEach(function(){
            var testErr = 'testError';
            testClient = {get: function(key, callback){return callback(testErr, null)}};
            testRedisClient.testStub(testRedis, testClient, testLogger);

            spyOn(testClient, 'get').and.callThrough();
        });

        it('when unable to connect to Redis server', function(){
            testRedisClient.redisLookup('testKey', testCB);
            expect(testLogger.error).toHaveBeenCalled();
        });
    });

    describe('returns and logs null', function(){
        beforeEach(function(){
            testClient = {get: function(key, callback){return callback(null, null)}};
            testRedisClient.testStub(testRedis, testClient, testLogger);

            spyOn(testClient, 'get').and.callThrough();
        });

        it('when no record is found in Redis', function(){
            testRedisClient.redisLookup('testKey', testCB);
            expect(testLogger.debug).toHaveBeenCalled();
        });
    });
});