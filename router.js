const express = require('express');
const router = express.Router();
const userRoute = require('./routes/user');
const passport = require('passport');
const authRoute = require('./routes/auth');
const eventRoute = require('./routes/event');
const paymentRoute = require('./routes/payment');
const itemRegistryRoute = require('./routes/itemRegistry');
const hat = require('hat');
//models
const mongoose = require('mongoose');
const Event = mongoose.model('Event');


//user creation and auth
// router.post('/signup', userRoute.signUp);
router.post('/profile', ensure, userRoute.setProfile);
router.get('/profile', ensure, userRoute.getProfile);
router.post('/login', passport.authenticate('local', {}), (req, res) => {
    res.send({
       Data:{
           authToken: hat.rack()()
       },
       RespCode: "LOGINSUCCESS",
       RespMessage: "User authenticated successfully"
    })
    // res.send('success');
});
router.post('/sms', userRoute.signUp, authRoute.generateCodeForPhoneNumber);

//event creation and maintenance
router.post('/event', ensure, eventRoute.createEvent);
router.get('/events', ensure, eventRoute.getEveryEvent);
router.post('/event/:eventId', ensure, isUserAdmin, eventRoute.updateEvent);
router.get('/event/:eventId', ensure, isUserAttendee, eventRoute.getEventById);
router.post('/event/payment/:eventId', ensure, isUserAttendee, eventRoute.addExactPayment);
router.post('/event/invite/:eventId', ensure, isUserAttendee, userRoute.signUp, eventRoute.inviteUser);
router.get('/usersEvents', ensure, eventRoute.getUsersEvents);
router.get('/invitedEvents', ensure, eventRoute.getInvitedEvents);
router.get('/createdEvents', ensure, eventRoute.getUsersEvents);
router.get('/markEventAsDeleted/:eventId', ensure, isUserAdmin, eventRoute.markEventAsDeleted);
router.post('/updateEventsAttendee/:attendeeId', ensure, isUserAdmin, eventRoute.updateEventsAttendee);

//payments
router.get('/userPayments', ensure, paymentRoute.getSumOfPayments);
router.get('/eventPayments/:eventId', ensure, isUserAttendee, paymentRoute.getEventPayments);

//items
router.post('/addItemToEvent/:id', ensure, isUserAttendee, itemRegistryRoute.addItem);
router.get('/getItemsForAnEvent/:eventId', ensure, isUserAttendee, itemRegistryRoute.getItemsForAnEvent);
router.post('/subscribeForItem/:id', ensure, isUserAttendee, itemRegistryRoute.signUpForItem);

//notes
//fetch item registry related to an event
//contact us
//feedback



module.exports = router;

function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('not authenticated');
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
            res.send('you are not authorized');
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
            let attendee = event.attendees.find((attendee) => {
                return attendee.user.id.toString() === mongoose.Types.ObjectId(req.user.id).id.toString();
            });

            if (attendee){
                next();
            }else{
                res.send('you are not authorized');
            }
        });
}


// // *** user data ***
// //upcoming / past / my events
// //events returns all of them
// router.get('/events', userRoute.signUp);
// //send all the data
// router.post('/events');
// //event types -- make it public and private
// router.get('/eventTypes');
// router.post('/eventTypes');
// //send events which are in the future, you are invited and you are not a host
// router.get('/pendingEvents');
// //users response about attendence at event
// router.post('/eventResponse/eventId');
// //returns every event's money and the sum
// router.post('/money');
//
//
// //think about notifications
