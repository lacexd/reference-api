const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');
const Attendee = mongoose.model('Attendee');
const authRoute = {
    createEvent(req, res) {
        const event = new Event(validators.newEvent(req.body));
        event.save((err) => {
            if (err) res.send(err);
        });
        User.findById(req.user.id, (err, user) => {
            user.createdEvents.push(event.id);
            user.save((err) => {
                if (err) res.send(err);
                res.send(event);
            });
        });
    },

    updateEvent(req, res) {
        if (!req.params.id) {
            res.send('id is missing');
        } else {
            Event.findById(req.params.id, (err, event) => {
                for (let i in event) {
                    if (req.body[i]) {
                        event[i] = req.body[i];
                    }
                }
                event.save((err) => {
                    if (err) res.send(err);
                    res.send(event);
                });
            });
        }
    },

    getEventById(req, res) {
        Event.findById(req.params.id, (err, event) => {
            if (err) {
                res.send(err);
            } else {
                res.send(event);
            }
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
                path: 'createdEvents',
                populate: {
                    path: 'payments',
                    model: 'Payment'
                }
            })
            .exec((err, user) => {
                res.send(user.invitedEvents);
            });
    },

    inviteUser(req, res) {
        Event.findById(req.params.id, (err, event) => {
            User.findOne({
                phoneNumber: req.body.phoneNumber
            }, (err, user) => {
                const attendeeData = req.body;
                attendeeData.user = user.id;
                attendeeData.role = 'default';
                attendeeData.status = 'default';
                let attendee = new Attendee(attendeeData);
                attendee.save((err) => {
                    if (err) {
                        res.send(err);
                    } else {
                        event.attendees.push(attendee.id);
                        event.save((err) => {
                            if (err) res.send(err);
                            res.send('userInvited');
                        });
                    }
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
