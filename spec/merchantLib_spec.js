var testMerchantLib = require('../lib/merchantLib');
var testMerchantModel;
var testCounterModel;
var testJWT;
var testMerchantMap;
//var testMerchantCounter = function(callback) { return callback(null, 1) };
var initialize;
var testCB = function(arg1, arg2){return {err: arg1, res: arg2}};
var testLogger;
var testNewMerchObj = {name: 'testMerchant'};

describe('merchantLib', function(){

    describe('saves new merchants to database: ', function(){

        beforeEach(function(){
            testCounterModel = {findByIdAndUpdate: function(){ return testCB(null, 4)} };
            //testMerchantModel = {findOneAndRemove: function(){}, update: function(){}, save: function(){}, findOne: function(){}};
            testMerchantMap = function(newMerchantObj, callback) { return initialize };
            //testMerchantCounter = {findByIdAndUpdate: function(callback){return callback(null, 1)}};
            testJWT = {sign: function(){}};
            testLogger = {error: function(){}, debug: function(){}};
            testMerchantLib.testStub(testCounterModel, testMerchantModel, testJWT, testLogger);

            spyOn(testCounterModel, 'findByIdAndUpdate');
            //spyOn(testMerchantModel, 'findOneAndRemove');
            //spyOn(testMerchantModel, 'update');
            //spyOn(testMerchantModel, 'save');
            //spyOn(testMerchantModel, 'findOne');
            spyOn(initialize, 'merchantCounter');
            spyOn(testJWT, 'sign');
            spyOn(testLogger, 'debug');
            spyOn(testLogger, 'error');

            //testMerchantLib.merchantCreate({name: 'testMerchant'}, testCB);
        });

        //it('finds merchant counter record and updates/increments internalID', function(){
        //    testMerchantLib.merchantCreate(testNewMerchObj, testCB);
        //    expect(testCounterModel.findByIdAndUpdate).toHaveBeenCalled();
        //});
        //
        //it('starts mapping new merchants by calling merchantCounter', function(){
        //    testMerchantMap(testNewMerchObj, testCB);
        //    expect(testMerchantMap.testMerchantCounter).toHaveBeenCalled();
        //});
        //
        //it('assigns a new posapi token to new merchants', function(){
        //    expect(testJWT.sign).toHaveBeenCalled();
        //});


        //it('merchantCounter that finds/updates merchant counter', function(){
        //    expect(testCounterModel.findByIdAndUpdate).toHaveBeenCalled();
        //});
        //
        //it('merchantMap that calls merchantCounter and maps new merchant', function(){
        //    expect(testJWT.sign).toHaveBeenCalled();
        //});

    });

});