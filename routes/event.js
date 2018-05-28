const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');
const Attendee = mongoose.model('Attendee');
const EventType = mongoose.model('EventType');
const format = require('../lib/response-format');
const eventRoute = {
		createEvent(req, res) {
			//calculate end date based on start date and event length
			req.body.host = mongoose.Types.ObjectId(req.user.id);
			req.body.creator = mongoose.Types.ObjectId(req.user.id);
			if(!req.body.currency){
				req.body.currency = req.user.currency;
			}
			const event = new Event(validators.newEvent(req.body));
			event.save((err) => {
				if (err) res.send(format.error(err));
			});
			User.findById(req.user.id, (err, user) => {
				//IMPLEMENT - add creator to attendees as moderator WITH STATUS ACCEPTED
				if (err) return res.send(format.error(err));
				user.createdEvents.push(event.id);
				user.save((err) => {
					if (err) return res.send(format.error(err));
					// res.send(event);
				});
				let attendee = new Attendee({
					user: user.id,
					status: 'accepted',
					role: 'moderator',
					isCreator: true
				});
				attendee.save((err) => {
					if (err) return res.send(format.error(err));
					event.attendees.push(attendee.id);
					event.save((err) => {
						if (err) res.send(format.error(err));
						res.send(format.success(event, 'event created successfully'));
					});
				});
			});
		},

		getEveryEvent(req, res) {
			Event
				.find({
					_id: req.user.invitedEvents.concat(req.user.createdEvents).map((v) => mongoose.Types.ObjectId(v))
				})
				.populate({
					path: 'attendees',
					populate: {
						path: 'user',
						select: 'phoneNumber'
					},
				})
				.populate({
					path: 'itemRegistry',
					populate: {
						path: 'user',
						select: 'phoneNumber'
					}
				})
				.populate({
					path: 'payments'
				})
				.exec((err, events) => {
					if (err) return res.send(format.error(err));

					var userId = req.user.id;
					Payment
						.find({
							$or: [{
								submitter: userId
							}, {
								reciever: userId
							}]
						})
						.populate('user')
						.exec((err, payments) => {
							if (err) return res.send(format.error(err));
							res.send({
								Data: {
									events: events,
									payments: {
										toPay: payments.filter((v) => {
											// console.log(money(v.cost).from('USD').to('EUR'));
											return v.reciever.toString() === userId;
										}),
										toGet: payments.filter((v) => {
											return v.submitter.toString() === userId;
										})
									}
								},
								RespCode: 'SUCCESS',
								RespMessage: 'Data has fectched successfully'
							});
						});
				});
		},

		updateEvent(req, res) {
			if (!req.params.eventId) {
				res.send('id is missing');
			} else {
				Event.findById(req.params.eventId, (err, event) => {
					if (err) return res.send(format.error(err));
					for (let i in event) {
						if (req.body[i]) {
							event[i] = req.body[i];
						}
					}
					event.save((err) => {
						if (err) return res.send(format.error(err));
						res.send(event);
					});
				});
			}
		},

		getEventById(req, res) {
			Event.findById(req.params.eventId)
			.populate({
				path: 'attendees',
				populate: {
					path: 'user',
					select: 'phoneNumber'
				},
			})
			.populate({
				path: 'itemRegistry',
				populate: {
					path: 'user',
					select: 'phoneNumber'
				}
			})
			.populate({
				path: 'payments'
			}).exec((err, event) => {
					if (err) return res.send(format.error(err));
					res.send(format.success(event, 'Event retrieved successfully'));
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
				if (err) return res.send(format.error(err));
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
				if (err) return res.send(format.error(err));
				res.send(user.invitedEvents);
			});
	},

	inviteUser(req, res) {
		Event.findById(req.params.eventId, (err, event) => {
			if (err) return res.send(format.error(err));
			User.findOne({
				phoneNumber: req.body.phoneNumber
			}, (err, user) => {
				if (err) return res.send(format.err(err));
				if (user) {
					const attendeeData = req.body;
					attendeeData.user = user.id;
					attendeeData.role = 'default';
					attendeeData.status = 'default';
					let attendee = new Attendee(attendeeData);
					attendee.save((err) => {
						if (err) return res.send(format.error(err));
						event.attendees.push(attendee.id);
						event.save((err) => {
							if (err) return res.send(format.error(err));
							res.send(format.success(event, 'User invited successfully'));
						});
					});
					user.invitedEvents.push(event.id);
					user.save((err) => {
						if (err) return res.send(format.error(err));
					});
				} else {
					res.send('user not found');
				}
			});
		});
	},

	addExactPayment(req, res) {
		Event.findById(req.params.eventId, (err, event) => {
			if (err) return res.send(format.error(err));
			const paymentData = req.body;
			paymentData.submitter = req.user.id;
			if (paymentData.reciever) {
				User.findOne({
					phoneNumber: paymentData.reciever
				}, (err, user) => {
					if (err && user) {
						return res.send(format.error(err));
					} else {
						paymentData.reciever = user.id;
						const payment = new Payment(validators.newPayment(paymentData));
						payment.save((err) => {
							if (err) {
								return res.send(format.error(err));
							} else {
								event.payments.push(payment.id);
								event.save((err) => {
									if (err) {
										return res.send(format.error(err));
									} else {
										res.send(format.success(event, 'Payment submitted successfully'));
									}
								});
							}
						});
					}
				});
			} else {
				event.attendees.forEach((attendee) => {
					User.findOne({
						id: attendee
					}, (err, user) => {
						if (err && user) {
							return res.send(format.error(err));
						} else {
							paymentData.reciever = user.id;
							req.body.status = 'self';
							const payment = new Payment(validators.newPayment(paymentData));
							payment.save((err) => {
								if (err) {
									return res.send(format.error(err));
								} else {
									event.payments.push(payment.id);
									event.save((err) => {
										if (err) {
											return res.send(format.error(err));
										} else {
											res.send(format.success(event, 'Payment submitted successfully'));
										}
									});
								}
							});
						}
					});
				});
			}
		});
	},

	usersPayments(req, res) {
		Event
			.find({
				_id: req.user.invitedEvents.concat(req.user.createdEvents).map((v) => mongoose.Types.ObjectId(v))
			})
			.where('category').equals('exact')
			.exec((err, events) => {
				if (err) return res.send(format.error(err));
				res.send(events);
			});
	},

	markEventAsDeleted(req, res) {
		var userId = req.user.id;
		Event
			.findById(req.params.eventId)
			.populate({
				path: 'attendees',
				model: 'Attendee'
			})
			.exec((err, event) => {
				if (err) return res.send(format.error(err));
				var authorizedUserForEvent = event.attendees.find((v) => {
					return v.user.toString === userId && v.role === 'moderator';
				});
				if (authorizedUserForEvent) {
					event.isMarkedAsDeleted = true;
					event.save((err) => {
						if (err) return res.send(format.error(err));
						res.send(201);
					});
				} else {
					res.send('user is not authorized');
				}
			});
	},

	updateEventsAttendee(req, res) {
		const attendeeId = req.params.ateendeeId;
		Attendee.findById(attendeeId, (err, attendee) => {
			if (req.body.status) {
				attendee.status = req.body.status;
			}
			if (req.body.isFree) {
				attendee.isFree = req.body.isFree;
			}
			if (req.body.role) {
				attendee.role = req.body.role;
			}
			attendee.save((err) => {
				if (err) return res.send(format.error(err));
				res.send('updated');
			});
		});
	},

	getEventTypes(req, res) {
		EventType.find({}, (err, eventTypes) => {
			res.send(format.success(eventTypes, 'Event types fetched successfully'))
		})
	}
};

const validators = {
	newEvent(body) {
		if (body.days && !body.hours) {
			let startDate = new Date(body.startDate);
			body.endDate = new Date(startDate.setTime(startDate.getTime() + body.days * 86400000));
		} else if (body.hours && !body.days) {
			let startDate = new Date(body.startDate);
			startDate.setHours(startDate.getHours() + body.hours);
			body.endDate = startDate;
		}
		return body;
	},

	newPayment(body) {
		return body;
	}
};

module.exports = eventRoute;
