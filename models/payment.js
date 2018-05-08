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
    reciever: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    cost: {
        type: 'Number'
    },
    name: {
      type: 'String'
    },
    currency: {
        type: 'String',
        enum: currencies
    },
    paidFor: {
        type: 'String'
    },
    quantity: {
        type: 'Number'
    },
    status: {
        type: 'String',
        //expense and self will never change
        // when someone enters cost status is expense -- never changes
        // when someone pays money status is payment, when someone confirms the payment status is settled
        // when someone submitter === reciever status is self -- never changes
        enum: ['expense', 'payment', 'settled'],
        defaultsTo: 'expense'
    },
    isApproved: {
        type: 'Boolean',
        default: false
    },
    expenseDate: {
      type: 'Date'
    },
    settlementDate: {
      type: 'Date'
    }

});

mongoose.model('Payment', PaymentSchema);
