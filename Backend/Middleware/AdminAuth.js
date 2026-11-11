
const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Admin token is required.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication configuration error.",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Store admin information for next middleware or route
    req.admin = decoded;

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Admin session expired. Please login again.",
      });
    }

    return res.status(401).json({
      message: "Invalid admin token.",
    });
  }
}

module.exports = adminAuth;
