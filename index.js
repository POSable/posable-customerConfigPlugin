function CustomerConfigPlugin () {

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/paymentData');

}



module.exports = new CustomerConfigPlugin();