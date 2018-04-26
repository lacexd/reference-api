const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: {
        type: 'String',
        default: '',
        required: true
    },
    //dont forget to create a table
    type: {
        type: 'String'
    },
    //ui sends hours - calculate on the backend
    category: {
        type: 'String',
        enum: ['contribution', 'sponsored']
    },
    location: {
        type: 'String',
        default: '',
        required: true
    },
    startDate: {
        type: 'Date',
        required: true
    },
    endDate: {
        type: 'Date'
    },
    // splitType: {
    //     type: 'String',
    //     enum: ['exact', 'equal']
    // },
    host: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isSettlementRequired: {
        type: 'Boolean',
        default: true
    },
    //if true every payment needs approval
    isVerificationRequired: {
        type: 'Boolean',
        default: false
    },

    days: {
        type: 'Number'
    },

    hours: {
        type: 'Number'
    },
    //is true if the createor and at least one attendee accepted
    // isActive: {
    //     type: 'Boolean',
    //     default: false
    // },
    status: {
        type: 'String',
        enum: ['created', 'canceled', 'closed'],
        default: 'created'
    },
    isItemRegistry: {
        type: 'Boolean',
        default: false
    },
    itemRegistry: [{
        type: Schema.ObjectId,
        ref: 'ItemRegistry'
    }],
    //based on this we need to change the end date
    // occurence: {
    //     type: 'String',
    //     enum: ['daily', 'weekly', 'monthly', 'yearly']
    // },
    attendees: [{
        type: Schema.ObjectId,
        ref: 'Attendee'
    }],
    isMarkedAsDeleted: {
        type: 'Boolean',
        default: false
    },
    payments: [{
        type: Schema.ObjectId,
        ref: 'Payment'
    }],
});

mongoose.model('Event', EventSchema);
