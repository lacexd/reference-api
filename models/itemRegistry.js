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
    //think about implementation
    quantity: {
        type: 'Number',
        default: 1
    },
    assigned: {
        type: Schema.ObjectId,
        ref: 'User'
    }
    //when user is assigned create a payment in payment table with link to this record
});

mongoose.model('ItemRegistry', ItemSchema);
