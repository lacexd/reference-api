const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const currencies = require('./static/countries').map((v) => {
    return v.currency[0];
});

const ItemSchema = new Schema({
    name: {
        type: 'String'
    },
    cost: {
        type: 'Number'
    },
    currency: {
        type: 'String',
        enum: currencies
    }
});

mongoose.model('ItemRegistry', ItemSchema);
