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
        enum: ['accepted', 'declined', 'interested', 'default']
    },
    role: {
        type: 'String',
        enum: ['moderator', 'default', 'free']
    }
});

mongoose.model('Attendee', AttendeeSchema);
