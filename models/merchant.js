var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
    name: String,
    posapiToken: String,
    activeStatus: Boolean,
    timezone: String,
    posVendorID: Number,
    internalID: Number,
    responseType: String,
    merchantID: String

});

MerchantSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'merchantCounter'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.internalID = counter.seq;
        next();
    });
});

module.exports = {
    model : mongoose.model('Merchant', MerchantSchema)
};

