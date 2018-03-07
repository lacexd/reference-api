const mongoose = require('mongoose');
// const Event = mongoose.model('Event');
// const User = mongoose.model('User');
const Payment = mongoose.model('Payment');
// const Attendee = mongoose.model('Attendee');
const authRoute = {
    getSumOfPayments(req, res) {
        var userId = req.user.id;
        Payment.find({
            $or: [{
                submitter: userId
            }, {
                reciever: userId
            }]
        }, (err, payments) => {
            if(err) return res.send(err);
            res.send({
                toPay: payments.filter((v) => {
                    return v.reciever.toString() === userId;
                }),
                toGet: payments.filter((v) => {
                    return v.submitter.toString() === userId;
                })
            });
        });
    }
};


module.exports = authRoute;
