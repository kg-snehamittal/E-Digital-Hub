const Order = require('../models/Order');

/**
 * @desc    Get orders (Admin: all orders, User: own orders)
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res) => {
  try {
    const filter = req.auth.role === 'admin' ? {} : { userid: req.auth.uid };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  const { cartItems, addressInfo, paymentId, date } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart items cannot be empty' });
  }

  try {
    const order = await Order.create({
      cartItems,
      addressInfo,
      paymentId,
      date: date || new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      email: req.auth.email,
      userid: req.auth.uid,
      status: 'Placed',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message || 'Error creating order' });
  }
};

module.exports = {
  getOrders,
  createOrder,
};
