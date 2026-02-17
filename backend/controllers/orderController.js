const Order = require("../models/Order");
const Product = require("../models/Product");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    const userId = req.user.id;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    // Check stock and update product soldCount
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      // Deduct stock and increment soldCount
      product.stock -= item.quantity;
      product.soldCount = (product.soldCount || 0) + item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
      paymentStatus: "Pending"
    });

    // Populate user info and product details
    await order.populate("userId");

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .populate("userId", "name email")
      .populate("items.productId")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("items.productId");
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure user can only view their own order (unless admin)
    if (order.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus })
      },
      { new: true }
    ).populate("userId");

    if (!order) return res.status(404).json({ message: "Order not found" });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
