const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: {
        type: 'String',
        default: '',
        required: true
    },
    startDate: {
        type: 'Date',
        required: true
    },
    location: {
        type: 'String',
        default: '',
        required: true
    },
    type: {
        type: Schema.ObjectId,
        ref: 'EventType'
    },
    splitType: {
        type: 'String',
        enum: ['exact', 'equal']
    },
    category: {
        type: 'String',
        enum: ['selfSponsored', 'hostSponsored']
    },
    host: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    freeUsers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: 'Boolean',
        default: true
    },
    isItemRegistry: {
        type: 'Boolean',
        default: true
    },
    itemRegistry: [{
        type: Schema.ObjectId,
        ref: 'ItemRegistry'
    }],
    eventLength: {
        type: 'Number',
        default: 0
    },
    attendees: [{
        type: Schema.ObjectId,
        ref: 'Attendee'
    }],
    isSettlementRequired: {
        type: 'Boolean',
        default: true
    },
    isVerificationRequired: {
        type: 'Boolean',
        default: true
    },
    payments: [{
        type: Schema.ObjectId,
        ref: 'Payment'
    }],
});

mongoose.model('Event', EventSchema);
