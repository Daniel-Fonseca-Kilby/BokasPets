const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { orderSchema } = require('../validators/schemas');

router.route('/').post(protect, validate(orderSchema), addOrderItems).get(protect, getMyOrders);

module.exports = router;
