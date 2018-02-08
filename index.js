const express = require('express');
const app = express();
// const helmet = require('helmet');
// const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const user = require('./models/user');
const event = require('./models/event');
const User = mongoose.model('User');
// const ObjectId = require('mongoose').Types.ObjectId;
const router = require('./router');
const connection = mongoose.connection;
const session = require('express-session');
const uuidv1 = require('uuid/v1');

mongoose.connect('mongodb://asd:asd@ds161032.mlab.com:61032/mydb', {
    // server: {
    //     socketOptions: {
    //         keepAlive: 300000,
    //         connectTimeoutMS: 30000
    //     }
    // },
    // replset: {
    //     socketOptions: {
    //         keepAlive: 300000,
    //         connectTimeoutMS: 30000
    //     }
    // }
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'file:///home/n4r4/apps/test/index.html');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


passport.use(new Strategy({
    usernameField: 'phoneNumber',
    passwordField: 'code'
}, (phoneNumber, code, cb) => {
    User.findOne({
        phoneNumber: phoneNumber
    }, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        if (!user.temporaryCode === code) {
            return cb(null, false);
        }
        return cb(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    genid: function() {
        return uuidv1();
    },
    secret: 'keyboard cat'
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(router);

connection.on('error', () => {});
connection.once('open', () => {
    app.listen(3000, () => {});
});
