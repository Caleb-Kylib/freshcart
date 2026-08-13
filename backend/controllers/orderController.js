const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { normalizeKenyanPhone, stkPush, stkQuery } = require("../utils/daraja");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
const ownsOrder = (order, user) => user.role === "admin" || order.userId.toString() === user.id;

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, customerPhone, paymentMethod, shippingMethod, shippingCost } = req.body;
    if (!items?.length) return res.status(400).json({ message: "Order must contain at least one item" });

    for (const item of items) {
      if (!isValidObjectId(item.productId)) continue;
      const product = await Product.findById(item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      product.stock -= item.quantity;
      product.soldCount = (product.soldCount || 0) + item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id, items, totalAmount, shippingAddress, customerPhone,
      paymentMethod: paymentMethod || "M-Pesa", shippingMethod: shippingMethod || "Standard Delivery",
      shippingCost: shippingCost || 0, orderStatus: "Pending", paymentStatus: "Pending"
    });
    await order.populate("userId");
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.initiateDarajaStkPush = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!ownsOrder(order, req.user)) return res.status(403).json({ message: "Unauthorized" });
    if (order.paymentStatus === "Paid") return res.status(409).json({ message: "This order has already been paid." });

    const phone = normalizeKenyanPhone(req.body.phone || order.customerPhone);
    const result = await stkPush({ phone, amount: order.totalAmount, accountReference: `FC${order._id.toString().slice(-8)}`, transactionDesc: "FreshCart order" });
    order.customerPhone = phone;
    order.daraja = { merchantRequestId: result.MerchantRequestID, checkoutRequestId: result.CheckoutRequestID, resultDesc: result.ResponseDescription };
    await order.save();
    res.json({ message: "M-Pesa prompt sent. Enter your PIN to complete payment.", order });
  } catch (error) {
    console.error("Daraja STK Push Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const applyDarajaResult = async (order, result) => {
  const resultCode = Number(result.ResultCode);
  const metadata = result.CallbackMetadata?.Item || [];
  const receiptNumber = metadata.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
  order.daraja = {
    ...order.daraja?.toObject?.(), checkoutRequestId: result.CheckoutRequestID || order.daraja?.checkoutRequestId,
    merchantRequestId: result.MerchantRequestID || order.daraja?.merchantRequestId, resultCode,
    resultDesc: result.ResultDesc, receiptNumber: receiptNumber || order.daraja?.receiptNumber,
    paidAt: resultCode === 0 ? new Date() : order.daraja?.paidAt
  };
  if (resultCode === 0) { order.paymentStatus = "Paid"; order.orderStatus = "Processing"; }
  else if (Number.isFinite(resultCode)) order.paymentStatus = "Failed";
  await order.save();
};

exports.handleDarajaCallback = async (req, res) => {
  const result = req.body?.Body?.stkCallback;
  if (!result?.CheckoutRequestID) return res.status(400).json({ ResultCode: 1, ResultDesc: "Invalid callback" });
  try {
    const order = await Order.findOne({ "daraja.checkoutRequestId": result.CheckoutRequestID });
    if (!order) return res.status(404).json({ ResultCode: 1, ResultDesc: "Order not found" });
    await applyDarajaResult(order, result);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("Daraja callback error:", error.message);
    res.status(500).json({ ResultCode: 1, ResultDesc: "Unable to process callback" });
  }
};

exports.getDarajaPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!ownsOrder(order, req.user)) return res.status(403).json({ message: "Unauthorized" });
    if (order.paymentStatus === "Pending" && order.daraja?.checkoutRequestId) {
      try {
        const result = await stkQuery(order.daraja.checkoutRequestId);
        if (result.ResultCode !== undefined) await applyDarajaResult(order, result);
      } catch (error) { console.warn("Daraja status query skipped:", error.message); }
    }
    res.json({ order });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getOrders = async (req, res) => {
  try { res.json(await Order.find({ userId: req.user.id }).populate("userId", "name email").populate("items.productId").sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getAllOrders = async (req, res) => {
  try { res.json(await Order.find().populate("userId", "name email").populate("items.productId").sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email phone").populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!ownsOrder(order, req.user)) return res.status(403).json({ message: "Unauthorized" });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) }, { new: true }).populate("userId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
