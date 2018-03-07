const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');
const Attendee = mongoose.model('Attendee');
const authRoute = {
    createEvent(req, res) {
        const event = new Event(validators.newEvent(req.body));
        event.save((err) => {
            if (err) return res.send(err);
        });
        User.findById(req.user.id, (err, user) => {
            if (err) return res.send(err);
            user.createdEvents.push(event.id);
            user.save((err) => {
                if (err) return res.send(err);
                res.send(event);
            });
        });
    },

    getEveryEvent(req, res) {
        Event.find({
            _id: req.user.invitedEvents.concat(req.user.createdEvents).map((v) => mongoose.Types.ObjectId(v))
        }, (err, events) => {
            if (err) return res.send(err);
            res.send(events);
        });
    },

    updateEvent(req, res) {
        if (!req.params.id) {
            res.send('id is missing');
        } else {
            Event.findById(req.params.id, (err, event) => {
                if (err) return res.send(err);
                for (let i in event) {
                    if (req.body[i]) {
                        event[i] = req.body[i];
                    }
                }
                event.save((err) => {
                    if (err) return res.send(err);
                    res.send(event);
                });
            });
        }
    },

    getEventById(req, res) {
        Event.findById(req.params.id, (err, event) => {
            if (err) return res.send(err);
            res.send(event);
        });
    },

    getUsersEvents(req, res) {
        User.findById(req.user.id)
            .populate({
                path: 'createdEvents',
                populate: {
                    path: 'attendees',
                    model: 'Attendee'
                },
            })
            .populate({
                path: 'createdEvents',
                populate: {
                    path: 'payments',
                    model: 'Payment'
                }
            })
            .exec((err, user) => {
                if (err) return res.send(err);
                res.send(user.createdEvents);
                // Attendee.populate(user.createdEvents, {
                //     path: 'attendees'
                // }, (err, events) => {
                //     res.send(events);
                // });
            });
    },

    getInvitedEvents(req, res) {
        User.findById(req.user.id)
            .populate({
                path: 'invitedEvents',
                populate: {
                    path: 'attendees',
                    model: 'Attendee'
                },
            })
            .populate({
                path: 'invitedEvents',
                populate: {
                    path: 'payments',
                    model: 'Payment'
                }
            })
            .exec((err, user) => {
                if (err) return res.send(err);
                res.send(user.invitedEvents);
            });
    },

    inviteUser(req, res) {
        Event.findById(req.params.id, (err, event) => {
            if (err) return res.send(err);
            User.findOne({
                phoneNumber: req.body.phoneNumber
            }, (err, user) => {
                const attendeeData = req.body;
                attendeeData.user = user.id;
                attendeeData.role = 'default';
                attendeeData.status = 'default';
                let attendee = new Attendee(attendeeData);
                attendee.save((err) => {
                    if (err) return res.send(err);
                    event.attendees.push(attendee.id);
                    event.save((err) => {
                        if (err) res.send(err);
                        res.send('userInvited');
                    });
                });
                user.invitedEvents.push(event.id);
                user.save((err) => {
                    if (err) res.send(err);
                });
            });
        });
    },

    addExactPayment(req, res) {
        Event.findById(req.params.id, (err, event) => {
            if (err) return res.send(err);
            const paymentData = req.body;
            paymentData.submitter = req.user.id;
            User.findOne({
                phoneNumber: paymentData.reciever
            }, (err, user) => {
                if (err && user) {
                    res.send(err);
                } else {
                    paymentData.reciever = user.id;
                    const payment = new Payment(validators.newPayment(paymentData));
                    payment.save((err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            event.payments.push(payment.id);
                            event.save((err) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(event);
                                }
                            });
                        }
                    });
                }
            });
        });
    },

    usersPayments(req, res){
        Event
            .find({
                _id: req.user.invitedEvents.concat(req.user.createdEvents).map((v) => mongoose.Types.ObjectId(v))
            })
            .where('category').equals('exact')
            .exec((err, events) => {
                if (err) return res.send(err);
                res.send(events);
            });
    },

    markEventAsDeleted(req, res){
        var userId = req.user.id;
        Event
            .findById(req.params.id)
            .populate({
                path: 'attendees',
                model: 'Attendee'
            })
            .exec((err, event) => {
                if(err) return res.send(err);
                var authorizedUserForEvent = event.attendees.find((v) => {
                    return v.user.toString === userId && v.role === 'moderator';
                });
                if(authorizedUserForEvent){
                    event.isMarkedAsDeleted = true;
                    event.save((err) => {
                        if(err) return res.send(err);
                        res.send(201);
                    });
                }else{
                    res.send('user is not authorized');
                }
            });
    }
};

const validators = {
    newEvent(body) {
        return body;
    },

    newPayment(body) {
        return body;
    }
};

module.exports = authRoute;
