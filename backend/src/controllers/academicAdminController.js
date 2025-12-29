// src/controllers/academicAdminController.js
import bcrypt from 'bcryptjs';
import { createAcademicAdmin, findAllAcademicAdmins, updateAcademicAdminPassword } from '../models/academicAdminModel.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const getAllAcademicAdmins = async (req, res) => {
  try {
    const admins = await findAllAcademicAdmins(pool);
    res.json({
      success: true,
      academicAdmins: admins  // No stats object anymore
    });
  } catch (error) {
    console.error("Get Academic Admins Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createNewAcademicAdmin = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      mobile, 
      role, 
      academicAdmins,  // this is branch
      password, 
      confirmPassword, 
      twoFactor 
    } = req.body;

    // VALIDATION
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, password, and confirm password are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminData = {
      fullName,
      email,
      mobile: mobile || null,
      role: role || 'Academic Admin',
      branch: academicAdmins,
      passwordHash,
      twoFactor: !!twoFactor
    };

    const newAdmin = await createAcademicAdmin(pool, adminData);

    res.status(201).json({
      success: true,
      message: "Academic Admin created successfully",
      admin: newAdmin  // No stats
    });
  } catch (error) {
    console.error("Create Academic Admin Error →", error.message);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: "Email or username already exists"
      });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const academicAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find admin by email
    const { rows } = await pool.query(
      `SELECT * FROM academic_admins WHERE email = $1 AND status = 'Active'`,
      [email]
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials or account not active"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "academicadmin",
        branch: admin.branch,
        fullName: admin.full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Academic Admin login successful",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: "academicadmin",
        branch: admin.branch
      }
    });

    // save the current time as last login
    await pool.query(
      `UPDATE academic_admins SET last_login = NOW() WHERE id = $1`,
      [admin.id]
    );

  } catch (error) {
    console.error("Admin Login Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const academicAdminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // From JWT via middleware
    console.log("User ID from token:", userId);

    // VALIDATION
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New password and confirm password do not match"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 8 characters long"
      });
    }

    // Find current academic admin
    const { rows } = await pool.query(
      `SELECT * FROM academic_admins WHERE id = $1`,
      [userId]
    );
    const admin = rows[0];
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    const updatedUser = await updateAcademicAdminPassword(pool, userId, newPasswordHash);
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        error: "Failed to update password"
      });
    }

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Academic Admin Change Password Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getAllAcademicAdmins, createNewAcademicAdmin, academicAdminLogin, academicAdminChangePassword };