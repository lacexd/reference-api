const express = require('express');
const router = express.Router();
const userRoute = require('./routes/user');
const passport = require('passport');
const authRoute = require('./routes/auth');
const eventRoute = require('./routes/event');
const paymentRoute = require('./routes/payment');
//user creation and auth
router.post('/signup', userRoute.signUp);
router.post('/profile', ensure, userRoute.setProfile);
router.get('/profile', ensure, userRoute.getProfile);
router.post('/login', passport.authenticate('local', {}), (req, res) => {
    res.send('success');
});
router.post('/sms', authRoute.generateCodeForPhoneNumber);

//event creation and maintenance
router.post('/event', ensure, eventRoute.createEvent);
router.get('/events', ensure, eventRoute.getEveryEvent);
router.post('/event/:id', ensure, eventRoute.updateEvent);
router.get('/event/:id', ensure, eventRoute.getEventById);
router.post('/event/payment/:id', ensure, eventRoute.addExactPayment);
router.post('/event/invite/:id', ensure, eventRoute.inviteUser);
router.get('/usersEvents', ensure, eventRoute.getUsersEvents);
router.get('/invitedEvents', ensure, eventRoute.getInvitedEvents);
router.get('/createdEvents', ensure, eventRoute.getUsersEvents);
router.get('/markEventAsDeleted/:id', ensure, eventRoute.markEventAsDeleted);
//payments

router.get('/userPayments', ensure, paymentRoute.getSumOfPayments);

module.exports = router;

function ensure(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('not authenticated');
    }
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
