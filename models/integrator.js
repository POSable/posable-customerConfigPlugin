var mongoose = require('mongoose');

var IntegratorSchema = new mongoose.Schema({
    companyName: String,
    phone: String,
    responseType: String

});

module.exports = {
    model : mongoose.model('Integrator', IntegratorSchema)
};