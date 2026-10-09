const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, getOrders);
router.post('/', requireAuth, createOrder);

module.exports = router;
