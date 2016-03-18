var mongoose = require('mongoose');

var InvoiceConfigSchema = new mongoose.Schema({
    merchantID: String,
    customerID: String,
    salesLineItemID: String,
    taxLineItemID: String,
    giftLineItemID: String,
    discountLineItemID: String,
    batchType: String,
    batchTime: String,
    visaID: String,
    mastercardID: String,
    amexID: String,
    discoverID: String,
    debitID: String,
    cashID: String,
    checkID: String,
    ebtID: String,
    fsaID: String,
    accountingClient: String,
    cloudElemAPIKey: String
});


module.exports = {
    model : mongoose.model('InvoiceConfig', InvoiceConfigSchema)
};