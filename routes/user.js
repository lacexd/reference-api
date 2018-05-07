const mongoose = require('mongoose');
const User = mongoose.model('User');
const format = require('../lib/response-format');

const userRoute = {
    signUp(req, res, next) {
        var userData = req.body;
        User.find({
            phoneNumber: userData.phoneNumber
        }, (err, user) => {
            if (user.length !== 0) {
                // res.send('exists');
                next();
            } else {
                console.log(userData);
                var newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        res.send('error');
                    } else {
                        next();
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
                res.send(format.success({
                    phoneNumber: user.phoneNumber,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    email: user.email,
                    address: user.address,
                    currency: user.currency
                }, 'User\'s profile fetched successfully'));
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
