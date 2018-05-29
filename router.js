const express = require('express');
const router = express.Router();
const userRoute = require('./routes/user');
const passport = require('passport');
const authRoute = require('./routes/auth');
const eventRoute = require('./routes/event');
const paymentRoute = require('./routes/payment');
const itemRegistryRoute = require('./routes/itemRegistry');
const format = require('./lib/response-format');
const hat = require('hat');
//models
const mongoose = require('mongoose');
const Event = mongoose.model('Event');


router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/documentation');
	} else {
		res.sendFile(__dirname + '/documentation/login.html');
	}
});

router.get('/documentation', ensure, ((req, res) => {
	res.sendFile(__dirname + '/documentation/documentation.html');
}))

//user creation and auth
// router.post('/signup', userRoute.signUp);
router.post('/profile', ensure, userRoute.setProfile);
router.get('/profile', ensure, userRoute.getProfile);
router.post('/signedUpUsers', ensure, userRoute.getRegisteredUsers);
router.post('/login', passport.authenticate('local', {failureRedirect: '/loginFailure'}), (req, res) => {
	res.send({
		Data: {
			authToken: hat.rack()()
		},
		RespCode: "LOGINSUCCESS",
		RespMessage: "User authenticated successfully"
	})
});
router.get('/loginFailure', (req, res) => {
  res.send(format.error({
    message: 'Wrong password or username / phone number'
  }))
})
router.post('/sms', userRoute.signUp, authRoute.generateCodeForPhoneNumber);

//joined endpoints
router.get('/dashboard', ensure, ensure, eventRoute.getEveryEvent);



//event creation and maintenance
router.post('/event', ensure, eventRoute.createEvent);
router.get('/events', ensure, eventRoute.getEveryEvent);
router.post('/event/:eventId', ensure, isEventIdPresent, isUserAdmin, eventRoute.updateEvent);
router.get('/event/:eventId', ensure, isEventIdPresent, isUserAttendee, eventRoute.getEventById);
router.post('/event/payment/:eventId', ensure, isEventIdPresent, isUserAttendee, eventRoute.addExactPayment);
router.post('/event/invite/:eventId', ensure, isEventIdPresent, isUserAttendee, eventRoute.inviteUser);
router.get('/usersEvents', ensure, eventRoute.getUsersEvents);
router.get('/invitedEvents', ensure, eventRoute.getInvitedEvents);
router.get('/createdEvents', ensure, eventRoute.getUsersEvents);
router.get('/markEventAsDeleted/:eventId', ensure, isEventIdPresent, isUserAdmin, eventRoute.markEventAsDeleted);
router.post('/updateEventsAttendee/:attendeeId', ensure, isAttendeeIdPresent, isUserAdmin, eventRoute.updateEventsAttendee);
router.get('/eventTypes', eventRoute.getEventTypes);



//payments
router.get('/userPayments', ensure, paymentRoute.getSumOfPayments);
router.get('/eventPayments/:eventId', ensure, isEventIdPresent, isUserAttendee, paymentRoute.getEventPayments);
router.get('/settlePayment/:paymentId', ensure, isPaymentIdPresent, isUserAttendee, paymentRoute.pay);
router.post('/createPaymentWithoutEvent', ensure, paymentRoute.createPaymentWithoutEvent);

//items
router.post('/addItemToEvent/:eventId', ensure, isEventIdPresent, isUserAttendee, itemRegistryRoute.addItem);
router.post('/markItemAsDeleted/:itemId', ensure, isItemIdPresent, isUserAttendee, itemRegistryRoute.markItemAsDeleted);
router.post('/editItem/:itemId', ensure, isItemIdPresent, isUserAttendee, itemRegistryRoute.editItem);
router.get('/getItemsForAnEvent/:eventId', ensure, isEventIdPresent, isUserAttendee, itemRegistryRoute.getItemsForAnEvent);
router.post('/subscribeForItem/:itemId', ensure, isItemIdPresent, itemRegistryRoute.signUpForItem);

//notes
//fetch item registry related to an event
//contact us
//feedback

module.exports = router;

function ensure(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.send(format.error({
      message: 'Forbidden, you are not authenticated'
    }));
	}
}

function isUserAdmin(req, res, next) {
	const eventId = req.params.eventId;
	Event
		.findById(eventId)
		.populate({
			path: 'attendees',
			model: 'Attendee'
		})
		.exec((err, event) => {
			if (err) return res.send(err);
			let attendee = event.attendees.find((attendee) => {
				return attendee.user.id.toString() === mongoose.Types.ObjectId(req.user.id).id.toString();
			});

			if (attendee.isCreator) next();
			res.send(format.error({
				message: 'Unsufficient provilege'
			}))
		});
}

function isUserAttendee(req, res, next) {
	const eventId = req.params.eventId;
	Event
		.findById(eventId)
		.populate({
			path: 'attendees',
			model: 'Attendee'
		})
		.exec((err, event) => {
			if (err) return res.send(err);
			if (!event) return res.send(format.error({
				message: 'Event was not found for the given ID'
			}));
			let attendee = event.attendees.find((attendee) => {
				return attendee.user.id.toString() === mongoose.Types.ObjectId(req.user.id).id.toString();
			});
			if (attendee) {
				next();
			} else {
				res.send(format.error({
					message: 'Unsufficient provilege'
				}))
			}
		});
}

function isEventIdPresent(req, res, next){
  if(!req.params.eventId){
    res.send(format.error({
      message: 'Event id must be provided!'
    }))
  }else{
    next();
  }
}

function isPaymentIdPresent(req, res, next){
  if(!req.params.paymentId){
    res.send(format.error({
      message: 'Payment id must be provided!'
    }))
  }else{
    next();
  }
}

function isAttendeeIdPresent(req, res, next){
  if(!req.params.attendeeId){
    res.send(format.error({
      message: 'Attendee id must be provided!'
    }))
  }else{
    next();
  }
}

function isItemIdPresent(req, res, next){
  if(!req.params.itemId){
    res.send(format.error({
      message: 'Item id must be provided'
    }))
  }else{
    next();
  }
}
