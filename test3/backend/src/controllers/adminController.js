const Cart = require('../models/Cart');

async function getAllUsersCarts(req, res) {
  try {
    const items = await Cart.find()
      .populate('productId')
      .populate('userId', 'name email role')
      .sort({ updatedAt: -1 });

    const grouped = new Map();

    items.forEach((item) => {
      if (!item.userId) {
        return;
      }

      const key = item.userId._id.toString();
      if (!grouped.has(key)) {
        grouped.set(key, {
          user: item.userId,
          items: []
        });
      }

      grouped.get(key).items.push(item);
    });

    return res.json(Array.from(grouped.values()));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load user carts' });
  }
}

module.exports = {
  getAllUsersCarts
};
