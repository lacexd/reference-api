const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const twilio = require('twilio');
// const client = new twilio('AC8a30f945adda617b145996ec29599139', '846aa6c4a42df2920ab61a6ae776cfdb');

const authRoute = {
    generateCodeForPhoneNumber(req, res) {
        User.findOne({
            phoneNumber: req.body.phoneNumber
        }, (err, user) => {
            if (user) {
                user.temporaryCode = getCode(1000, 10000);
                // client.messages.create({
                //     from: 'we need to get a number',
                //     to: '+36303727512',
                //     body: 'lol',
                // }).then((message) => {
                //     console.log(message);
                // });
                console.log(user.temporaryCode);
                user.save((err) => {
                    if (!err) {
                        res.send('sms sent');
                    } else {
                        res.send(403);
                    }
                });
            } else {
                res.send('user was not found, please sign up');
            }
        });
    }
};

function getCode(minimum, maximum) {
    var maxBytes = 6;
    var maxDec = 281474976710656;

    var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
    var result = Math.floor(randbytes / maxDec * (maximum - minimum + 1) + minimum);

    if (result > maximum) {
        result = maximum;
    }
    return result;
}

module.exports = authRoute;
