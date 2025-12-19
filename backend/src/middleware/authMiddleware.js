// // middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';

// const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: "Token required" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = { studentId: decoded.id };
//     next();
//   });
// };

// export { authenticateToken };

// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const protectSuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin") {
      return res.status(403).json({ success: false, error: "Access denied: Super Admin only" });
    }
    req.user = decoded;  // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export default protectSuperAdmin;