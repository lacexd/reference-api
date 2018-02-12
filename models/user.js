const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const countries = require('../static/countries');
const currencies = countries.map((v) => {
    return v.currency[0];
});

const UserSchema = new Schema({
    phoneNumber: {
        type: 'String',
        default: '',
    },
    firstName: {
        type: 'String',
        default: ''
    },
    lastName: {
        type: 'String',
        default: ''
    },
    gender: {
        type: 'String',
        enum: ['male', 'female'],
        defaultsTo: 'male'
    },
    email: {
        type: 'String',
        default: ''
    },
    address: {
        type: 'String',
        default: ''
    },
    invitedEvents: [{
        type: Schema.ObjectId,
        ref: 'Event'
    }],
    createdEvents: [{
        type: Schema.ObjectId,
        ref: 'Event'
    }],
    appInstalled: {
        type: Boolean
    },
    temporaryCode: {
        type: 'Number'
    },
    currency: {
        type: 'String',
        enum: currencies
    },
    country: {
        type: 'String'
    }
});

UserSchema.pre('save', function(next) {
    let countryIdMap = countries.map((v) => {
        return {
            code: v.callingCode[0],
            name: v.cca2
        };
    });
    if (this.phoneNumber) {
        countryIdMap.forEach((v) => {
            if (this.phoneNumber.indexOf('+' + v.code) === 0){
                this.country = v.name;
            }
        });
    }
    // next(new Error('Invalid password'));
    next();
});

mongoose.model('User', UserSchema);
