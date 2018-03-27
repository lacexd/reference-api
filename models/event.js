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
    //ui sends hours - calculate on the backend
    endTime: {
        type: 'Date'
    },
    location: {
        type: 'String',
        default: '',
        required: true
    },
    //dont forget to create a table
    type: {
        type: Schema.ObjectId,
        ref: 'EventType'
    },
    // splitType: {
    //     type: 'String',
    //     enum: ['exact', 'equal']
    // },
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
    //is true if the createor and at least one attendee accepted
    // isActive: {
    //     type: 'Boolean',
    //     default: false
    // },
    status: {
        type: 'String',
        enum: ['created', 'canceled', 'closed']
    },
    isItemRegistry: {
        type: 'Boolean',
        default: true
    },
    itemRegistry: [{
        type: Schema.ObjectId,
        ref: 'ItemRegistry'
    }],
    //based on this we need to change the end date
    length: {
        type: 'Number',
        default: 1
    },
    // occurence: {
    //     type: 'String',
    //     enum: ['daily', 'weekly', 'monthly', 'yearly']
    // },
    attendees: [{
        type: Schema.ObjectId,
        ref: 'Attendee'
    }],
    isSettlementRequired: {
        type: 'Boolean',
        default: true
    },
    //if true every payment needs approval
    isVerificationRequired: {
        type: 'Boolean',
        default: true
    },
    isMarkedAsDeleted: {
        type: 'Boolean',
        default: true
    },
    payments: [{
        type: Schema.ObjectId,
        ref: 'Payment'
    }],
});

mongoose.model('Event', EventSchema);
