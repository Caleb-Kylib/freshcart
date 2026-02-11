const router = require("express").Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  res.json(cart);
});

router.post("/", protect, async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true }
  );
  res.json(cart);
});

module.exports = router;
