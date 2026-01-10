// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Super Admin Protection
export const protectSuperAdmin = (req, res, next) => {
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


// Academic Admin Protection
export const protectAcademicAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "academicadmin") {
      return res.status(403).json({ success: false, error: "Access denied: Academic Admin only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};




// Faculty Protection (ADD THIS)
export const protectFaculty = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'faculty') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Verify faculty exists and is active
    const { rows } = await pool.query(
      'SELECT id FROM faculty WHERE id = $1 AND status = $2',
      [decoded.id, 'Active']
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Faculty not found or inactive' });
    }

    req.user = { id: decoded.id, role: 'faculty' };
    next();
  } catch (error) {
    console.error('Faculty auth error:', error);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Student Protection 
export const protectStudent = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'student') {
        return res.status(401).json({ success: false, error: 'Not authorized' });
      }

      const { rows } = await pool.query('SELECT id, email FROM students WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      req.user = { id: rows[0].id, email: rows[0].email, role: 'student' };
      next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

  