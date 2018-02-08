const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');

const authRoute = {
    createEvent(req, res) {
        const event = new Event(req.body);
        event.save((err) => {
            if(err) res.send(err);
            // res.send(event);
        });
        User.findById(req.user.id, (err, user) => {
            user.createdEvents.push(event.id);
            user.save((err) => {
                if(err) res.send(err);
                res.send(event);
            });
        });
    },

    getUsersEvents(req, res){
        User.findById(req.user.id).populate('createdEvents').exec((err, user) => {
            res.send(user.createdEvents);
        });
    },

    getInvitedEvents(req, res){
        User.findById(req.user.id).populate('invitedEvents').exec((err, user) => {
            res.send(user.invitedEvents);
        });
    },

    inviteUser(req, res){
        User.findById(req.body.phoneNumber, (err, user) => {
            Event.findById(req.body.eventId, (err, event) => {
                user.invitedEvents.push(event.id);
                user.save((err) => {
                    if(err) res.send(err);
                    res.send('userInvited');
                });
            });
        });
    }
};

module.exports = authRoute;
