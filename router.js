const express = require('express');
const router = express.Router();
const userRoute = require('./routes/user');
const passport = require('passport');
const authRoute = require('./routes/auth');
const eventRoute = require('./routes/event');

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
router.get('/usersEvents', ensure, eventRoute.getUsersEvents);
router.get('invitedEvents', ensure, eventRoute.getInvitedEvents);
router.get('createdEvents', ensure, eventRoute.getUsersEvents);



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
