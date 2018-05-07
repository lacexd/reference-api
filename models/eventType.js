const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventType = new Schema({
    name: {
        type: 'String'
    }
});

mongoose.model('EventType', EventType);
