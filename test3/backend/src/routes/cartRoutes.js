const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

module.exports = router;
