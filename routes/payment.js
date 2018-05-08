const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const format = require('../lib/response-format');
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
			if (err) return res.send(err);
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
			if (err) return res.send(err);
			Payment.find({
				_id: event.payments
			}, (err, payments) => {
				if (err) return res.send(err);
				res.send(payments);
			});
		});
	},

	pay(req, res) {
		Payment.findById(req.params.paymentId, (err, payment) => {
			if(err) return res.send(format.error(err));
			payment.status = 'settled';
			payment.save((err) => {
				res.send(format.error(err));
			})
		})
	},

  createPaymentWithoutEvent(req, res) {
    const event = new Event({
      name: 'None Event - ' + req.body.name,
      location: 'None location',
      startDate: new Date()
    });
    event.save((err) => {
      if(err) return res.send(format.error(err));
      req.body.submitter = req.user.id;
      User.find({
        phoneNumber: req.body.reciever
      }, (err, user) => {
        if(err) return res.send(format.error(err));
        if(user.length === 0) return res.send(format.error({
          message: 'User not found'
        }));
        req.body.reciever = user.id;
        const payment = new Payment(req.body);
        payment.save((err) => {
          if(err) return res.send(format.error(err));
          user.createdEvents.push(event.id);
          user.save((err) => {
            if(err) return res.send(format.error(err));
            res.send(format.success({
              payment,
              event,
              user
            }, 'None event payment successfully created'));
          })
        });
      })
    });
  }


};


module.exports = authRoute;
