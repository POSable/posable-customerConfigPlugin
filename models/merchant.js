var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
    companyName: String,
    posapiToken: String,
    activeStatus: Boolean,
    timezone: String,
    posVendorID: Number,
    customerID: Number

});

MerchantSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'merchantCounter'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.customerID = counter.seq;
        next();
    });
});

module.exports = {
    model : mongoose.model('Merchant', MerchantSchema)
};

