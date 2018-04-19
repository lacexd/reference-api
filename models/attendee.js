const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: 'String',
        enum: ['accepted', 'declined', 'default'],
        default: 'default'
    },
    role: {
        type: 'String',
        enum: ['moderator', 'default']
    },
    isFree: {
        type: 'Boolean',
        default: false
    },
    isCreator: {
        type: 'Boolean',
        default: false
    }
});

mongoose.model('Attendee', AttendeeSchema);
