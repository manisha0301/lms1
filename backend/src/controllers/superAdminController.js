// src/controllers/superAdminController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findSuperAdminByEmail } from '../models/superAdminModel.js';
import pool from '../config/db.js';

// Simple email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters"
      });
    }

    // AUTHENTICATION
    const superAdmin = await findSuperAdminByEmail(pool, email);
    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // SUCCESS – Generate JWT
    const token = jwt.sign(
      { id: superAdmin.id, role: "superadmin", email: superAdmin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Super Admin login successful",
      token,
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        role: "superadmin"
      }
    });

  } catch (error) {
    console.error("Super Admin Login Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { superAdminLogin };