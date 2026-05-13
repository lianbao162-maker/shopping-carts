const Cart = require('../models/Cart');

async function getCart(req, res) {
  try {
    const cartItems = await Cart.find().populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load cart' });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    let item = await Cart.findOne({ productId });

    if (item) {
      item.quantity += quantity;
    } else {
      item = new Cart({ productId, quantity });
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
}

async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    const item = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
}

async function deleteCartItem(req, res) {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cart item' });
  }
}

async function clearCart(req, res) {
  try {
    await Cart.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
};
