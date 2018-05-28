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
		const bodyPhoneNumbers = req.body.map((user) => user.phoneNumber);
		User.find({
			phoneNumber: {
				"$in": bodyPhoneNumbers
			}
		}, (err, users) => {
			if(err) return res.send(format.error(err));
			const alreadySignedUp = req.body.filter((user) => {
				const foundBodyUser = users.find((dbUser) => {
					return user.phoneNumber === dbUser.phoneNumber;
				})
				if(foundBodyUser){
					return {
						name: foundBodyUser.name,
						phoneNumber: user.phoneNumber
					}
				}
			});
			const alreadySignedUpNumbers = alreadySignedUp.map((v) => v.phoneNumber);

			const notSignedUpUsers = req.body.filter((user) => {
				return alreadySignedUpNumbers.indexOf(user.phoneNumber) === -1;
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
			let phoneNumberChanged = false;
			for (var i in user) {
				if (req.body[i] && i !== 'phoneNumber') {
					user[i] = req.body[i];
				}
				if(i === 'phoneNumber'){
					user.phoneNumber = req.body.phoneNumber;
					phoneNumberChanged = true;
				}
			}
			user.save((err) => {
        if(err) return res.send(format.error(err));
				if(phoneNumberChanged){
					req.logout();
					res.send(format.success({}, 'User was logged out successfully'));
				}else{
					res.send(format.success(user, 'User\'s profile updated successfully'));
				}
			});
		});
	}
};

module.exports = userRoute;
