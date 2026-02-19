const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "customer" } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password with salt rounds
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role
    });

    // Generate token
    const token = generateToken(user);

    // Return user without password
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user);

    // Return user without password
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all users (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
