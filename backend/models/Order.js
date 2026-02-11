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
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    shippingAddress: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
