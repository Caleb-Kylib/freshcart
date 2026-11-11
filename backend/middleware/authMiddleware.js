const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

exports.managerOnly = (req, res, next) => {
  if (req.user.role !== "manager" && req.user.role !== "admin")
    return res.status(403).json({ message: "Manager or Admin access required" });
  next();
};

exports.adminOrManager = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.user.role))
    return res.status(403).json({ message: "Manager or Admin access required" });
  next();
};
