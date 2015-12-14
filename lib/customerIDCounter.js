function getNextSequence(companyName) {
    var ret = db.paymentData.findAndModify(
        {
            query: { customerID: companyName },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );

    return ret.seq;
}


module.exports = getNextSequence();
