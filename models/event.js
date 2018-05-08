const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: {
        type: 'String',
        default: '',
        required: true
    },
    type: {
        type: 'String'
    },
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
    host: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isExpensesAllowed: {
        type: 'Boolean',
        default: true
    },
    isExpenseApprovalRequired: {
        type: 'Boolean',
        default: false
    },
    days: {
        type: 'Number'
    },
    hours: {
        type: 'Number'
    },
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
    currency: {
      type: 'String'
    }
});

mongoose.model('Event', EventSchema);
