const Order = require("../models/Order");
const Product = require("../models/Product");
const pesapalConfig = require("../utils/pesapal");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, customerPhone } = req.body;
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
      customerPhone,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      pesapalMerchantReference: `FC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    // Populate user info and product details
    await order.populate("userId");

    // Pesapal Integration Logic
    if (req.body.paymentMethod === 'Pesapal') {
      try {
        const token = await pesapalConfig.getAuthToken();
        const ipnId = await pesapalConfig.registerIPN(token, "https://example.com/api/orders/pesapal-ipn"); // Requires public IPN URL
        
        const orderData = {
          id: order.pesapalMerchantReference,
          currency: "KES",
          amount: totalAmount,
          description: `FreshCart Order ${order._id}`,
          callback_url: "http://localhost:5173/payment-status",
          notification_id: ipnId,
          billing_address: {
            email_address: order.userId.email,
            phone_number: customerPhone,
            country_code: "KE",
            first_name: order.userId.name,
            middle_name: "",
            last_name: "",
            line_1: shippingAddress,
            line_2: "",
            city: "",
            state: "",
            postal_code: "",
            zip_code: ""
          }
        };

        const pesapalResponse = await pesapalConfig.submitOrder(token, orderData);
        
        // Save tracking ID
        order.pesapalOrderTrackingId = pesapalResponse.order_tracking_id;
        await order.save();

        return res.status(201).json({ 
          order, 
          redirect_url: pesapalResponse.redirect_url 
        });
      } catch (pesapalError) {
        console.error("Pesapal Process Error:", pesapalError);
        // Fallback to manual M-Pesa or standard creation if Pesapal fails to generate link
        return res.status(201).json({ order, pesapalError: "Failed to generate payment link" });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pesapal IPN Webhook
exports.pesapalIPN = async (req, res) => {
  try {
    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.query;
    
    if (!OrderTrackingId) {
      return res.status(400).json({ error: "Missing tracking ID" });
    }

    const token = await pesapalConfig.getAuthToken();
    const statusData = await pesapalConfig.getTransactionStatus(token, OrderTrackingId);

    const order = await Order.findOne({ pesapalOrderTrackingId: OrderTrackingId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (statusData.payment_status_description === "COMPLETED") {
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      await order.save();
    } else if (statusData.payment_status_description === "FAILED" || statusData.payment_status_description === "INVALID") {
      order.paymentStatus = "Failed";
      await order.save();
    }

    res.status(200).json({ status: 200, message: "IPN Received and Processed" });
  } catch (error) {
    console.error("IPN Process Error:", error);
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
