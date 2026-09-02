const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT Bearer token in the Authorization header.
 * Attaches decoded payload { id, role, ... } to req.user upon success.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

/**
 * Middleware to restrict access to users with the 'admin' role.
 * Must be placed after authenticateToken middleware.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
};
