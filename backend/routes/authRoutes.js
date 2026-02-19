const router = require("express").Router();
const { register, login, getUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Admin routes
router.get("/users", protect, adminOnly, getUsers);

module.exports = router;
