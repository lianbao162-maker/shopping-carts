const Cart = require('../models/Cart');

async function getCart(req, res) {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load cart' });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    let item = await Cart.findOne({ userId: req.user._id, productId });

    if (item) {
      item.quantity += quantity;
    } else {
      item = new Cart({ userId: req.user._id, productId, quantity });
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
    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { quantity },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
}

async function deleteCartItem(req, res) {
  try {
    const deleted = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cart item' });
  }
}

async function clearCart(req, res) {
  try {
    await Cart.deleteMany({ userId: req.user._id });
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
