var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
    name: String,
    posapiToken: String,
    activeStatus: Boolean,
    timezone: String,
    posVendorID: Number,
    internalID: Number,
    responseType: String,
    merchantID: String,
    batchType: String,
    visaID: String,
    mastercardID: String,
    amexID: String,
    discoverID: String,
    cashID: String,
    depositAccountID: String,
    depositAccountName: String,
    batchTime: String,
    accountingClient: String,
    cloudElemAPIKey: String
});


module.exports = {
    model : mongoose.model('Merchant', MerchantSchema)
};

