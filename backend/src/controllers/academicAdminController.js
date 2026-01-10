// src/controllers/academicAdminController.js
import bcrypt from 'bcryptjs';
import { createAcademicAdmin, findAllAcademicAdmins, updateAcademicAdminPassword } from '../models/academicAdminModel.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import { addNotificationForSuperAdmin } from '../models/notificationModel.js';

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
      academicAdmins, 
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

    if (mobile && !/^\+?[0-9]{10,15}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid mobile number"
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
      academic_name: academicAdmins,
      passwordHash,
      twoFactor: !!twoFactor
    };

    const newAdmin = await createAcademicAdmin(pool, adminData);

    const notifyMessage = `New Academic Admin created: ${newAdmin.fullName} (${newAdmin.email})`;
    await addNotificationForSuperAdmin(
      pool,
      notifyMessage,
      'admin',          // matches your frontend icon/color logic
      'medium'
    );

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
        academic_name: admin.academic_name,
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
        academic_name: admin.academic_name
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

// Get Academic Admin Profile
const getAcademicAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // from protect middleware

    const { rows } = await pool.query(`
      SELECT 
        a.id,
        a.full_name AS "fullName",
        a.email,
        a.username,
        a.role,
        a.status,
        a.academic_name AS "institution",
        a.mobile,
        d.date_of_birth AS "dateOfBirth",
        d.address,
        d.city,
        d.state,
        d.country,
        d.pincode,
        d.about,
        a.created_at AS "joinedAt"
      FROM academic_admins a
      LEFT JOIN academic_admin_details d ON a.id = d.admin_id
      WHERE a.id = $1
    `, [adminId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error('Get Academic Admin Profile Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update Academic Admin Profile
const updateAcademicAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const {
      fullName,
      mobile,
      dateOfBirth,
      address,
      city,
      state,
      country,
      pincode,
      about
    } = req.body;

    // Update main table
    await pool.query(
      `UPDATE academic_admins 
       SET full_name = COALESCE($1, full_name),
           mobile = COALESCE($2, mobile)
       WHERE id = $3`,
      [fullName, mobile, adminId]
    );

    // Update or insert details
    await pool.query(`
      INSERT INTO academic_admin_details (
        admin_id, date_of_birth, address, city, state, country, pincode, about
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (admin_id) DO UPDATE SET
        date_of_birth = EXCLUDED.date_of_birth,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        country = EXCLUDED.country,
        pincode = EXCLUDED.pincode,
        about = EXCLUDED.about,
        updated_at = CURRENT_TIMESTAMP
    `, [adminId, dateOfBirth, address, city, state, country, pincode, about]);

    // Return fresh profile
    const { rows } = await pool.query(`
      SELECT 
        a.id,
        a.full_name AS "fullName",
        a.email,
        a.username,
        a.role,
        a.status,
        a.academic_name AS "institution",
        a.mobile,
        d.date_of_birth AS "dateOfBirth",
        d.address,
        d.city,
        d.state,
        d.country,
        d.pincode,
        d.about,
        d.joined_at AS "joinedAt"
      FROM academic_admins a
      LEFT JOIN academic_admin_details d ON a.id = d.admin_id
      WHERE a.id = $1
    `, [adminId]);

    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update' });
  }
};

// Get Assigned Courses (name, price only)
const getAssignedCourses = async (req, res) => {
  try {
    const adminId = req.user.id;

    const { rows } = await pool.query(`
      SELECT c.id, c.name, c.price , c.description , c.teachers
      FROM courses c
      JOIN course_academic_assignments ca ON c.id = ca.course_id
      WHERE ca.academic_admin_id = $1
      ORDER BY c.created_at DESC
    `, [adminId]);

    res.json({ success: true, courses: rows });
  } catch (error) {
    console.error('Get Assigned Courses Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get Course Details 
const getCourseDetails = async (req, res) => {
  try {
    const adminId = req.user.id;
    const courseId = req.params.id;

    const { rows } = await pool.query(`
      SELECT c.id, c.name, c.price, c.description, c.type, c.duration, c.image, c.contents
      FROM courses c
      JOIN course_academic_assignments ca ON c.id = ca.course_id
      WHERE ca.academic_admin_id = $1 AND c.id = $2
    `, [adminId, courseId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found or not assigned' });
    }

    res.json({ success: true, course: rows[0] });
  } catch (error) {
    console.error('Get Course Details Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export { 
  getAllAcademicAdmins, 
  createNewAcademicAdmin, 
  academicAdminLogin, 
  academicAdminChangePassword,
  getAcademicAdminProfile,
  updateAcademicAdminProfile,
  getAssignedCourses,
  getCourseDetails
};
