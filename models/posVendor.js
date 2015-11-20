var mongoose = require('mongoose');

var posVendorSchema = new mongoose.Schema({
    posName: Boolean,
    integratorID: Number

});

module.exports = {
    model : mongoose.model('posVendor', posVendorSchema)
};