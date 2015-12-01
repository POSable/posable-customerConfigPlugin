var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
    companyName: String,
    posapiToken: String,
    activeStatus: Boolean,
    timezone: String,
    posVendorID: Number,

});

module.exports = {
    model : mongoose.model('Merchant', MerchantSchema)
};