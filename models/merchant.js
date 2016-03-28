var mongoose = require('mongoose');
require('./invoiceConfig');

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
    email: String,
    invoiceConfig: mongoose.model('InvoiceConfig').schema
});

module.exports = {
    model : mongoose.model('Merchant', MerchantSchema)
};