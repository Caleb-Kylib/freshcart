const Order = require("../models/Order");
const Product = require("../models/Product");
const { initiateMpesaSTK, checkPaymentStatus } = require("../utils/intasend");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, customerPhone, paymentMethod, shippingMethod, shippingCost } = req.body;
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

    // Create order in DB
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      customerPhone,
      shippingMethod: shippingMethod || "Standard Delivery",
      shippingCost: shippingCost || 0,
      orderStatus: "Pending",
      paymentStatus: "Pending"
    });

    // Populate user info
    await order.populate("userId");

    // --- IntaSend M-Pesa STK Push ---
    if (paymentMethod === "M-Pesa" || paymentMethod === "Pesapal") {
      try {
        const stkResult = await initiateMpesaSTK({
          phone: customerPhone,
          amount: totalAmount,
          orderId: order._id.toString(),
          email: order.userId?.email || "",
          name: order.userId?.name || ""
        });

        // Save the invoice ID so we can check status later
        order.intasendInvoiceId = stkResult.id || stkResult.invoice_id;
        await order.save();

        return res.status(201).json({
          order,
          stkPushSent: true,
          message: "M-Pesa prompt sent to your phone. Enter your PIN to complete payment."
        });
      } catch (stkError) {
        console.error("IntaSend STK Push Error:", stkError.message);
        // Order is still saved — just no automatic STK push
        return res.status(201).json({
          order,
          stkPushSent: false,
          stkError: stkError.message,
          message: "Order placed but STK push failed. Please pay manually."
        });
      }
    }

    // For any other payment method (cash on delivery, etc.) just save and return
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IntaSend Payment Status Check (called from frontend polling)
exports.checkIntasendPayment = async (req, res) => {
  try {
    const { invoiceId, orderId } = req.body;

    if (!invoiceId || !orderId) {
      return res.status(400).json({ message: "invoiceId and orderId are required" });
    }

    const statusData = await checkPaymentStatus(invoiceId);
    const state = statusData?.invoice?.state; // "COMPLETE", "PENDING", "FAILED"

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (state === "COMPLETE") {
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      await order.save();
    } else if (state === "FAILED" || state === "CANCELLED") {
      order.paymentStatus = "Failed";
      await order.save();
    }

    res.json({ state, order });
  } catch (error) {
    console.error("IntaSend Status Check Error:", error.message);
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

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
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
