const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const request = require('request');
const twilio = require('twilio');
const client = new twilio('AC391b0b7d951a40e2a88eb016fff051c7', 'b6538ee515a2f6ad73a290e3379b40c5');

const authRoute = {
    generateCodeForPhoneNumber(req, res) {
        User.findOne({
            phoneNumber: req.body.phoneNumber
        }, (err, user) => {
            if (user) {
                const generatedCode = getCode(1000, 10000);
                user.temporaryCode = generatedCode;
                console.log(user.temporaryCode);

                whichProviderToUse(generatedCode, user.phoneNumber);

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

function whichProviderToUse(code, phoneNumber){
    var countryId = phoneNumber.substring(0, 3);
    var usId = phoneNumber.substring(0, 2);
    if(countryId === '+91'){
        messageIndianNumber(code, phoneNumber);
    }else if(usId === '+1'){
        messageUSNumber(code, phoneNumber);
    }else{
        console.log(code);
    }
}

function messageUSNumber(code, phoneNumber){
    client.messages.create({
        from: '+12108997218',
        to: phoneNumber,
        body: 'Hello, this is your code: ' + code,
    }).then((message) => {
        console.log(message);
    });
}

function messageIndianNumber(code, phoneNumber){
    var phoneNumberWithoutPlus = phoneNumber.toString().substring(3);
    request.get('http://103.233.79.246//submitsms.jsp?user=RadyasLC&key=851a8dfba3XX&mobile=' + phoneNumberWithoutPlus + '&message=' + code + '&senderid=MSODDY&accusage=1', {}, function(err, res) {
        console.log(res);
    });
}

module.exports = authRoute;
