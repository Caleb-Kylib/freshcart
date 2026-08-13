const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],
    totalAmount: Number,
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },
    shippingAddress: String,
    customerPhone: String,
    shippingMethod: { type: String, default: "Standard Delivery" },
    shippingCost: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "M-Pesa" },
    daraja: {
      merchantRequestId: String,
      checkoutRequestId: String,
      resultCode: Number,
      resultDesc: String,
      receiptNumber: String,
      paidAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
