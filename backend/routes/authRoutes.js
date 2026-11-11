const router = require("express").Router();
const { 
  register, 
  login, 
  getUsers, 
  getManagers, 
  createManager, 
  updateUserRole, 
  deleteUser 
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Admin routes
router.get("/users", protect, adminOnly, getUsers);
router.get("/managers", protect, adminOnly, getManagers);
router.post("/managers", protect, adminOnly, createManager);
router.put("/users/:userId/role", protect, adminOnly, updateUserRole);
router.delete("/users/:userId", protect, adminOnly, deleteUser);

module.exports = router;
