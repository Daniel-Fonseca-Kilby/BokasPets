const Order = require('../models/Order');
const User = require('../models/User');
const Dog = require('../models/Dog');
const { sendOrderStatusEmail } = require('../services/emailService');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // Populate user para obtener email y enviar notificación
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Notificar al usuario cuando el pedido cambia a estados relevantes
    // El email no debe interrumpir la actualización si falla
    if (status === 'processing' || status === 'delivered') {
      try {
        console.log(`Intentando enviar correo a ${order.user.email} por cambio a estado: ${status}`);
        await sendOrderStatusEmail(order.user, updatedOrder);
      } catch (emailError) {
        console.error('Error detallado de Resend:', {
          message: emailError.message,
          stack: emailError.stack,
          user: order.user.email
        });
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user details (including dogs and orders)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dogs = await Dog.find({ user: user._id });
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({ user, dogs, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDogs = async (req, res) => {
  try {
    const dogs = await Dog.find().populate('owner', 'name email');
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create admin user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Subtract points if it's a paid order
    if (order.isPaid && order.pointsEarned) {
      const user = await User.findById(order.user);
      if (user) {
        user.loyaltyPoints = Math.max(0, user.loyaltyPoints - order.pointsEarned);
        await user.save();
      }
    }

    await order.deleteOne();

    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res) => {
  try {
    const now = new Date();
    // Inicio del mes actual a las 00:00:00
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Hace exactamente 7 días
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Hace 5 meses (para tener 6 meses en total incluyendo el actual)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    // Hace 8 semanas
    const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

    /**
     * Aggregation pipeline de órdenes
     */
    const [orderMetrics] = await Order.aggregate([
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' }
              }
            }
          ],
          planDistribution: [
            { $unwind: '$items' },
            { $group: { _id: '$items.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          total: [{ $count: 'count' }],
          revenueByMonthRaw: [
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: { 
                  year: { $year: "$createdAt" }, 
                  month: { $month: "$createdAt" } 
                },
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Aggregation pipeline de usuarios
    const [userMetrics] = await User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          newThisWeek: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    // Construir datos de Revenue de 6 meses
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      revenueByMonth.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        revenue: 0,
        orders: 0
      });
    }

    (orderMetrics.revenueByMonthRaw || []).forEach(item => {
      const bucket = revenueByMonth.find(b => b.month === monthNames[item._id.month - 1] && b.year === item._id.year);
      if (bucket) {
        bucket.revenue = item.revenue;
        bucket.orders = item.orders;
      }
    });

    // Construir userGrowth (8 semanas)
    const userGrowth = [];
    for (let i = 7; i >= 0; i--) {
      userGrowth.push({
        week: `Sem ${8 - i}`,
        start: new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000),
        users: 0
      });
    }

    const recentUsers = await User.find({ createdAt: { $gte: eightWeeksAgo } }).select('createdAt');
    recentUsers.forEach(user => {
      for (const bucket of userGrowth) {
        if (user.createdAt >= bucket.start && user.createdAt < bucket.end) {
          bucket.users++;
          break;
        }
      }
    });

    const formattedUserGrowth = userGrowth.map(b => ({ week: b.week, users: b.users }));

    // Transformar status y mapear colores
    const statusMap = {};
    (orderMetrics.byStatus || []).forEach(({ _id, count }) => {
      statusMap[_id] = count;
    });

    const ordersByStatus = [
      { name: 'Pendientes', value: statusMap['pending'] || 0, color: '#f0a500' },
      { name: 'En Proceso', value: statusMap['processing'] || 0, color: '#2196f3' },
      { name: 'Entregados', value: statusMap['delivered'] || 0, color: '#4caf50' }
    ];

    const monthData = orderMetrics.thisMonth?.[0] || { count: 0, revenue: 0 };
    const totalOrders = orderMetrics.total?.[0]?.count || 0;

    // Transformar plan distribution
    const distributionRaw = orderMetrics.planDistribution || [];
    const mostSold = distributionRaw[0]?._id || 'N/A';
    
    // Mapeo de colores fijos para los planes más comunes
    const planColors = {
      'Bokita de Res': '#4e7a5e',
      'Bokita de Cerdo': '#8c6b5d',
      'Bokita Personalizada': '#f0a500',
      'Personalizado': '#f0a500'
    };
    
    const planDistribution = distributionRaw.map((d, index) => {
      const colors = ['#4e7a5e', '#8c6b5d', '#f0a500', '#2196f3', '#9c27b0'];
      return {
        name: d._id,
        value: d.count,
        color: planColors[d._id] || colors[index % colors.length]
      };
    });

    res.json({
      revenueByMonth: revenueByMonth.map(b => ({ month: b.month, revenue: b.revenue, orders: b.orders })),
      ordersByStatus,
      userGrowth: formattedUserGrowth,
      planDistribution,
      orders: {
        total: totalOrders,
        pending: statusMap['pending'] || 0,
        processing: statusMap['processing'] || 0,
        delivered: statusMap['delivered'] || 0,
        thisMonth: monthData.count,
        revenueThisMonth: monthData.revenue,
      },
      users: {
        total: userMetrics.total?.[0]?.count || 0,
        newThisWeek: userMetrics.newThisWeek?.[0]?.count || 0,
      },
      plans: {
        mostSold,
        distribution: distributionRaw.map((d) => ({ name: d._id, count: d.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
