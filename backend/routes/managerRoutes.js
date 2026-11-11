const router = require('express').Router();
const { protect, adminOrManager } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ── Manager Dashboard Overview ────────────────────────────────────────
router.get('/overview', protect, adminOrManager, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      lowStockCount: lowStockProducts.length,
      pendingOrders,
      processingOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── View all orders (manager can only view, not create) ────────────────
router.get('/orders', protect, adminOrManager, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { orderStatus: status } : {};

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price stock')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalOrders: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── View stock inventory ──────────────────────────────────────────────
router.get('/inventory', protect, adminOrManager, async (req, res) => {
  try {
    const { category, lowStockOnly = false, page = 1, limit = 20 } = req.query;
    const query = category ? { category } : {};
    if (lowStockOnly === 'true') query.stock = { $lt: 10 };

    const products = await Product.find(query)
      .sort({ stock: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);
    const totalValue = await Product.aggregate([
      { $match: query },
      { $group: { _id: null, value: { $sum: { $multiply: ['$price', '$stock'] } } } },
    ]);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total,
      inventoryValue: totalValue[0]?.value || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Generate sales report ────────────────────────────────────────────
router.get('/reports/sales', protect, adminOrManager, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const sales = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const summary = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]);

    res.json({
      dailySales: sales,
      summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Generate category report ─────────────────────────────────────────
router.get('/reports/categories', protect, adminOrManager, async (req, res) => {
  try {
    const categoryReport = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' },
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalSold: { $sum: '$soldCount' },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    res.json(categoryReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Order status breakdown ───────────────────────────────────────────
router.get('/reports/order-status', protect, adminOrManager, async (req, res) => {
  try {
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    res.json(statusBreakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Low stock alert ───────────────────────────────────────────────────
router.get('/alerts/low-stock', protect, adminOrManager, async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const lowStockProducts = await Product.find({ stock: { $lt: threshold } })
      .sort({ stock: 1 })
      .limit(20);

    res.json({
      threshold,
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
