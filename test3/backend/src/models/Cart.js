const { mongoose } = require('../config/db');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
