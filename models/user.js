const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
});

mongoose.model('User', UserSchema);
