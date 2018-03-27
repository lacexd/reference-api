const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencies = require('../static/countries').map((v) => {
    return v.currency[0];
});

const PaymentSchema = new Schema({
    submitter: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cost: {
        type: 'Number'
    },
    currency: {
        type: 'String',
        enum: currencies
    },
    reciever: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    expenseFor: {
        type: 'String'
    },
    quantity: {
        type: 'Number'
    },
    status: {
        type: 'String',
        enum: ['initial', 'payed', 'recieved']
    },
    isApproved: {
        type: 'Boolean'
    }
});

mongoose.model('Payment', PaymentSchema);
