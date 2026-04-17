const router = require("express").Router();
const { createOrder, getOrders, updateStatus, getOrderById, getAllOrders, checkIntasendPayment } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// User can create and view their orders
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// IntaSend payment status check
router.post("/check-payment", protect, checkIntasendPayment);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateStatus);

module.exports = router;
