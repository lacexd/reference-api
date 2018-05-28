const express = require('express');
const app = express();
const helmet = require('helmet');
// const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const user = require('./models/user');
const event = require('./models/event');
const eventType = require('./models/eventType');
const payment = require('./models/payment');
const attendee = require('./models/attendee');
const itemRegistry = require('./models/itemRegistry');
const itemQuantity = require('./models/itemQuantity');
const User = mongoose.model('User');
// const ObjectId = require('mongoose').Types.ObjectId;
const router = require('./router');
const connection = mongoose.connection;
const session = require('express-session');
const uuidv1 = require('uuid/v1');
const validator = require('express-validator');

app.use(express.static(__dirname));
app.use(express.static('documentation'));

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//device id
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
        if (user.temporaryCode !== code) {
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
app.use(helmet());
app.use(bodyParser.json({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(validator());
app.use(session({
    genid: function() {
        return uuidv1();
    },
    resave: false,
    saveUninitialized: true,
    secret: 'AfLLG48ggIkt3BOhL6igdMLQu7ab8lK',
    name: 'AfLLG48ggIkt3BOhL6igdMLQu7ab8lK&'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

connection.on('error', () => {});
connection.once('open', () => {
    app.listen(process.env.PORT || 3500, () => {
        console.log('runnin fine on port: ' + 3500);
    });
});
