const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, deleteOrder, getUsers, getUserDetail, getDogs, createAdminUser, getMetrics } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');
const { registerSchema } = require('../validators/schemas');
const { z } = require('zod');

const statusSchema = z.object({
  status: z.enum(['pending', 'processing', 'delivered'])
});

router.use(protect);
router.use(adminOnly);

router.route('/metrics').get(getMetrics);

router.route('/orders').get(getOrders);
router.route('/orders/:id').delete(deleteOrder);
router.route('/orders/:id/status').patch(validate(statusSchema), updateOrderStatus);

router.route('/users').get(getUsers).post(validate(registerSchema), createAdminUser);
router.route('/users/:id').get(getUserDetail);

router.route('/dogs').get(getDogs);

module.exports = router;

