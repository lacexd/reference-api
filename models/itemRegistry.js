const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: 'String'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: 'Number',
        default: 1
    },
    assignedTo: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isMarkedAsDeleted: {
        type: 'Boolean',
        default: false
    }    
});

mongoose.model('ItemRegistry', ItemSchema);
