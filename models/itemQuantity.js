const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemQuantitySchema = new Schema({
  user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
  },
  quantity: {
      type: 'Number',
      required: true,
      default: 0
  }
});

mongoose.model('ItemQuantity', ItemQuantitySchema);
