const router = require("express").Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
