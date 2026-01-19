// Get total user count (students + faculty + academic admins)
export const getTotalUserCount = async (req, res) => {
  try {
    const { rows: studentsCount } = await pool.query('SELECT COUNT(*) FROM students');
    const { rows: facultiesCount } = await pool.query('SELECT COUNT(*) FROM faculty');
    const { rows: adminsCount } = await pool.query('SELECT COUNT(*) FROM academic_admins');
    const total = parseInt(studentsCount[0].count, 10) + parseInt(facultiesCount[0].count, 10) + parseInt(adminsCount[0].count, 10);
    res.json({ success: true, totalUsers: total });
  } catch (error) {
    console.error('Get total user count error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user count' });
  }
};
// backend/src/controllers/superAdminController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findSuperAdminByEmail, updateSuperAdminPassword } from '../models/superAdminModel.js';
import pool from '../config/db.js';
import { getNotificationsByUser } from '../models/notificationModel.js';

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
      { expiresIn: '12h' }
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

const superAdminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // From JWT via middleware

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

    // Get current super admin
    const superAdmin = await findSuperAdminByEmail(pool, req.user.email);
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, superAdmin.password_hash);
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
    const updatedUser = await updateSuperAdminPassword(pool, userId, newPasswordHash);
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
    console.error("Super Admin Change Password Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Students (real)
    const { rows: studentsCount } = await pool.query('SELECT COUNT(*) FROM students');
    const totalStudents = parseInt(studentsCount[0].count, 10);

    // 2. Total Active Faculties (real)
    const { rows: facultiesCount } = await pool.query(
      "SELECT COUNT(*) FROM faculty WHERE status = 'Active'"
    );
    const totalFaculties = parseInt(facultiesCount[0].count, 10);

    // 3. Total Centres (unique academic_name / universities)
    const { rows: centresCount } = await pool.query(
      'SELECT COUNT(DISTINCT academic_name) FROM academic_admins WHERE academic_name IS NOT NULL AND academic_name != \'\''
    );
    const totalCentres = parseInt(centresCount[0].count, 10);

    // 4. Exams Conducted – kept as dummy (0) as per your request
    const examsConducted = 0;

    // Optional: Keep your existing counts if you still want them
    const academicsResult = await pool.query('SELECT COUNT(*) FROM academic_admins');
    const totalAcademics = parseInt(academicsResult.rows[0].count, 10);

    const coursesResult = await pool.query('SELECT COUNT(*) FROM courses');
    const totalCourses = parseInt(coursesResult.rows[0].count, 10);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculties,
        totalCentres,
        examsConducted,
        totalAcademics,     // optional
        totalCourses        // optional
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

export const getSuperAdminProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, phone, created_at FROM super_admins WHERE email = $1`,
      [req.user.email]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Super Admin not found' });
    }
    const superAdmin = rows[0];
    res.json({
      success: true,
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        full_name: superAdmin.full_name || 'Super Admin',
        phone: superAdmin.phone || '',
        created_at: superAdmin.created_at,
        role: "superadmin"
      }
    });
  } catch (error) {
    console.error('Get Super Admin Profile Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getSuperAdminNotifications = async (req, res) => {
  try {
    const { limit } = req.query;  // Optional ?limit=4 for recent notifications
    const notifications = await getNotificationsByUser(
      'superadmin',
      req.user.id,  // From JWT middleware
      limit ? parseInt(limit, 10) : null
    );

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get SuperAdmin Notifications Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all active institutes for student signup dropdown
export const getAcademicInstitutes = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT academic_name AS name 
      FROM academic_admins 
      WHERE status = 'Active' AND academic_name IS NOT NULL AND academic_name != ''
      ORDER BY academic_name ASC
    `);

    const institutes = rows.map(row => row.name);

    res.json({ success: true, institutes });
  } catch (error) {
    console.error('Get institutes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch institutes' });
  }
};

export { superAdminLogin, superAdminChangePassword };

export const updateSuperAdminProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const userId = req.user.id;

    // Build dynamic SET clause
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (fullName) {
      updates.push(`full_name = $${paramIndex}`);
      values.push(fullName.trim());
      paramIndex++;
    }
    if (phone) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone.trim());
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    values.push(userId);

    const query = `
      UPDATE super_admins
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, full_name, phone, created_at
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: rows[0]
    });
  } catch (error) {
    console.error('Update super admin profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};