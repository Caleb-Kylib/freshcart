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

// Get all managers (Admin only)
exports.getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }, "-password");
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new manager (Admin only)
exports.createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create manager user
    const manager = await User.create({
      name,
      email,
      password: hashed,
      role: "manager"
    });

    // Generate token
    const token = generateToken(manager);

    res.status(201).json({
      user: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role
      },
      token,
      message: "Manager created successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["customer", "manager", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent deleting last admin
    if (role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      const targetUser = await User.findById(userId);
      if (targetUser.role === "admin" && adminCount <= 1) {
        return res.status(400).json({ message: "Cannot remove the last admin" });
      }
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: updatedUser,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin" });
      }
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
      userId: userId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

