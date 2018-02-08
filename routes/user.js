const mongoose = require('mongoose');
const User = mongoose.model('User');

const userRoute = {
    signUp(req, res) {
        var userData = req.body;
        User.find({
            phoneNumber: userData.phoneNumber
        }, (err, user) => {
            if (user.length !== 0) {
                res.send('exists');
            } else {
                var newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        res.send('error');
                    } else {
                        res.send(201);
                    }
                });
            }
        });
    },

    getProfile(req, res) {
        User.findById(req.user.id)
            .populate('invitedEvents')
            .populate('createdEvents')
            .exec((err, user) => {
                res.send(user);
            });
    },

    setProfile(req, res) {
        User.findById(req.user.id, (err, user) => {
            for (var i in user) {
                if (req.body[i] && i !== 'phoneNumber') {
                    user[i] = req.body[i];
                }
            }
            user.save((err) => {
                if (err) {
                    res.send('error happened');
                } else {
                    res.send(user);
                }
            });
        });
    }
};

module.exports = userRoute;
