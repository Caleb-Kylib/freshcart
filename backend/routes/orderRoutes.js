const router = require("express").Router();
const { createOrder, getOrders, updateStatus, getOrderById, getAllOrders } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Webhooks (Public)
router.get("/pesapal-ipn", require("../controllers/orderController").pesapalIPN);
router.post("/pesapal-ipn", require("../controllers/orderController").pesapalIPN);

// User can create and view their orders
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateStatus);

module.exports = router;
