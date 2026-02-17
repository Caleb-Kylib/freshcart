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
    shippingAddress: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
