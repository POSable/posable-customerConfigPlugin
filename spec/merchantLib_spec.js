var testMerchantLib = require('../lib/merchantLib');
var testMerchantModel;
var testCounterModel;
var testJWT;
var testMerchantMap;
var testMerchantCounter;
var testNewMerchObj;
var testLogger;
var testCB;


describe('merchantLib', function(){
    beforeEach(function(){
        testNewMerchObj = {name: 'testMerchant', internalID: 1, save: function(){}};
        testLogger = {error: function(){}, debug: function(){}};
        testCB = function(arg1, arg2){return {err: arg1, res: arg2}};
    });

    describe('starts mapping new merchants by', function(){
        beforeEach(function(){
            testCounterModel = {findByIdAndUpdate: function(){}};
            testMerchantLib.testStub(testCounterModel);

            spyOn(testCounterModel, 'findByIdAndUpdate');
        });

        it('finding/updating the merchant counter record to increment the internalID', function(){
            testMerchantLib.merchantCreate(testNewMerchObj, testCB);
            expect(testCounterModel.findByIdAndUpdate).toHaveBeenCalled();
        });
    });

    describe('continues mapping', function(){
        beforeEach(function(){
            testJWT = {sign: function(){}};
            testMerchantCounter = function(callback) { return callback(null, 1)};
            testMerchantLib.testStub(null, null, testJWT, testLogger, null, testMerchantCounter);

            spyOn(testJWT, 'sign');

            testMerchantLib.merchantCreate(testNewMerchObj, testCB);
        });

        it('assigns a new posapi token to new merchants', function(){
            expect(testJWT.sign).toHaveBeenCalledWith({name: 'testMerchant', internalID: 1}, 'posapiToken');
        });
    });

    describe('finishes mapping by returning a merchant object', function(){
        beforeEach(function(){
            testMerchantMap = function(arg1, callback) { return callback(null, testNewMerchObj); };
            testMerchantLib.testStub(null, null, null, testLogger, testMerchantMap);

            spyOn(testNewMerchObj, 'save');
            spyOn(testLogger, 'debug');

            testMerchantLib.merchantCreate({}, testCB);
        });

        it('should return a new properly mapped merchant', function(){
            expect(testLogger.debug).toHaveBeenCalledWith('New merchant mapped successfully, saving...');
        });

        it('should call save on the new merchant', function(){
            expect(testNewMerchObj.save).toHaveBeenCalled();
        });
    });

    describe('is able to perform search/CRUD actions for merchants: ', function(){
        beforeEach(function(){
            testMerchantModel = {findOneAndRemove: function(){}, update: function(){}, findOne: function(){}};
            testMerchantLib.testStub(null, testMerchantModel, null, testLogger);

            spyOn(testMerchantModel, 'findOne');
            spyOn(testMerchantModel, 'findOneAndRemove');
            spyOn(testMerchantModel, 'update');
        });

        it('finds existing merchants', function(){
            testMerchantLib.merchantFind();
            expect(testMerchantModel.findOne).toHaveBeenCalled();
        });

        it('updates existing merchants', function(){
            testMerchantLib.merchantModify(testNewMerchObj);
            expect(testMerchantModel.update).toHaveBeenCalled();
        });

        it('deletes existing merchants', function(){
            testMerchantLib.merchantRemove(testNewMerchObj);
            expect(testMerchantModel.findOneAndRemove).toHaveBeenCalled();
        });
    });
});