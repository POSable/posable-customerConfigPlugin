//var baseCode = require('../index');
//var setConfigPlugin = baseCode.setConfigPlugin;
//var setTestStubs = baseCode.testingStub;
//var testFunctions;
//
//describe('Config plugin', function(){
//
//    testFunctions = {testSetLogger: function(){}, testRedisConnect: function(){}, test_dbConnect: function(){}};
//
//    beforeEach(function(){
//        spyOn(testFunctions, 'testSetLogger');
//        spyOn(testFunctions, 'testRedisConnect');
//        spyOn(testFunctions, 'test_dbConnect');
//        setTestStubs(testFunctions);
//        setConfigPlugin();
//    });
//
//    it('should call db, redis, and logger setup functions', function (){
//        expect(testFunctions.testSetLogger).toHaveBeenCalled();
//        expect(testFunctions.testRedisConnect).toHaveBeenCalled();
//        expect(testFunctions.test_dbConnect).toHaveBeenCalled();
//    });
//
//});