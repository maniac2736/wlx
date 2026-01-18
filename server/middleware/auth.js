const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    // Check Authorization header as fallback
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
      error: error.message,
    });
  }
};

module.exports = jwtMiddleware;
