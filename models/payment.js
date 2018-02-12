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
    }
});

mongoose.model('Payment', PaymentSchema);
