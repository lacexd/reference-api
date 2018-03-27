const mongoose = require('mongoose');
// const Event = mongoose.model('Event');
// const User = mongoose.model('User');
const Payment = mongoose.model('Payment');
const Event = mongoose.model('Event');
// const Attendee = mongoose.model('Attendee');
//const money = require('money');
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
                    // console.log(money(v.cost).from('USD').to('EUR'));
                    return v.reciever.toString() === userId;
                }),
                toGet: payments.filter((v) => {
                    return v.submitter.toString() === userId;
                })
            });
        });
    },

    getEventPayments(req, res) {
        Event.findById(req.params.eventId, (err, event) => {
            if(err) return res.send(err);
            Payment.find({
                _id: event.payments
            }, (err, payments) => {
                if(err) return res.send(err);
                res.send(payments);
            });
        });
    }
};


module.exports = authRoute;
