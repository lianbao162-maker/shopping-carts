const express = require('express');
const { getAllUsersCarts } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');

const router = express.Router();

router.get('/carts', requireAuth, requireRole('admin'), getAllUsersCarts);
router.get('/shopping_cart', requireAuth, requireRole('admin'), getAllUsersCarts);

module.exports = router;
