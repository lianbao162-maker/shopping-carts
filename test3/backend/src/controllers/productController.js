const Product = require('../models/Product');

async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load products' });
  }
}

module.exports = {
  getProducts
};
