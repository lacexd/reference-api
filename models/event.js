const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    address: {
        type: 'String',
        default: ''
    },
    guestNumber: {
        type: 'Number',
        default: 0
    },
    type: {
        type: 'String',
        enum: ['selfSponsored', 'hostSponsored']
    },
    paymentType: {
        type: 'String',
        enum: ['exact', 'equal']
    },
    host: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    active: {
        type: 'Boolean',
        default: true
    },
    occurence: {
        type: 'Number',
        default: 0
    }
});

mongoose.model('Event', EventSchema);
