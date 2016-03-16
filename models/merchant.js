var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
    name: String, // unique check
    contactInfo: Object,
    posUsername: String, // unique check
    posPassword: String, // unique check
    posapiToken: String,
    storeNumber: String, // unique check
    posSystem: String,
    activeStatus: {type: Boolean, default: true},
    timezone: String,
    posVendor: String,
    posVendorID: {type: Number, default: 0},
    internalID: Number,
    responseType: {type: String, default: 'xml'},
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