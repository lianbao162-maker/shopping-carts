const { mongoose } = require('../config/db');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageURL: String,
  description: String,
  stock: Number
});

module.exports = mongoose.model('Product', productSchema);
