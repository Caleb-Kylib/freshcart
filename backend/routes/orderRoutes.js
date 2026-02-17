const router = require("express").Router();
const { createOrder, getOrders, updateStatus, getOrderById } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// User can create and view their orders
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// Admin can update order status
router.put("/:id", protect, adminOnly, updateStatus);

module.exports = router;
