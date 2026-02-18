const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  let token = req.cookies.jwt;

  // Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token)
    return res.status(401).json({ message: "Unauthorized - Missing token" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decodedToken.userId, role: decodedToken.role };

    if (decodedToken.role !== 2 && decodedToken.role !== 3) {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = adminAuth;
