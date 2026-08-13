const router = require("express").Router();
const { createOrder, getOrders, updateStatus, getOrderById, getAllOrders, initiateDarajaStkPush, getDarajaPaymentStatus, handleDarajaCallback } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// User can create and view their orders
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

router.post("/daraja/callback", handleDarajaCallback);
router.post("/:id/stk-push", protect, initiateDarajaStkPush);
router.get("/:id/payment-status", protect, getDarajaPaymentStatus);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateStatus);

module.exports = router;
