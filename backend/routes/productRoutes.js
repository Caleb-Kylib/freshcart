const router = require("express").Router();
const ctrl = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", ctrl.getProducts);
router.get("/:id", ctrl.getProduct);

// Admin only routes
router.post("/", protect, adminOnly, ctrl.createProduct);
router.put("/:id", protect, adminOnly, ctrl.updateProduct);
router.delete("/:id", protect, adminOnly, ctrl.deleteProduct);

module.exports = router;
