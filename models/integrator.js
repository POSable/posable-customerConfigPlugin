var mongoose = require('mongoose');

var IntegratorSchema = new mongoose.Schema({
    companyName: String,
    phone: String


});

module.exports = {
    model : mongoose.model('Integrator', IntegratorSchema)
};