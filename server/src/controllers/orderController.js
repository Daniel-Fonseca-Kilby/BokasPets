const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (items && items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      // Calculate points (e.g., 1 point per $100)
      const pointsEarned = Math.floor(totalPrice / 100);

      const order = new Order({
        user: req.user.id,
        items,
        totalPrice,
        isPaid: true, // Simulating a paid order
        paidAt: Date.now(),
        pointsEarned
      });

      const createdOrder = await order.save();

      // Update user points
      const user = await User.findById(req.user.id);
      if (user) {
        user.loyaltyPoints += pointsEarned;
        await user.save();
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
