var testDB_Client = require('../lib/dbClient');
var testMongoose;


describe('dbClient', function() {

    beforeEach(function(){
        testMongoose = {connect: function(){return testMongooseReturn}};
        testDB_Client.testStub(testMongoose);

        spyOn(testMongoose, 'connect');
    });

    it('should call mongoose.connect within dbConnect', function() {
        testDB_Client.dbConnect('testDatabaseString');
        expect(testMongoose.connect).toHaveBeenCalledWith('testDatabaseString');
    });
});