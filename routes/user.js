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
				next();
			} else {
				var newUser = new User(userData);
				newUser.save((err) => {
					if (err) {
						if(err) return res.send(format.error(err));
					} else {
						next();
					}
				});
			}
		});
	},

	getRegisteredUsers(req, res) {
		User.find({
			phoneNumber: {
				"$in": req.body
			}
		}, (err, users) => {
			if(err) return res.send(format.error(err));
			const alreadySignedUp = users.map((user) => user.phoneNumber);
			const notSignedUpUsers = req.body.filter((user) => {
				return alreadySignedUp.indexOf(user) === -1;
			})
			res.send(format.success({
				alreadySignedUp,
				notSignedUpUsers
			}, 'These users are already signed up'));
		});
	},

	getProfile(req, res) {
		User.findById(req.user.id, (err, user) => {
      if(err) return res.send(format.error(err));
			res.send(format.success(user, 'User\'s profile fetched successfully'));
		});
	},

	setProfile(req, res) {
		User.findById(req.user.id, (err, user) => {
      if(err) return res.send(format.error(err));
			for (var i in user) {
				if (req.body[i]) {
					user[i] = req.body[i];
				}
			}
			user.save((err) => {
        if(err) return res.send(format.error(err));
					res.send(format.success(user, 'User\'s profile updated successfully'));
			});
		});
	}
};

module.exports = userRoute;
