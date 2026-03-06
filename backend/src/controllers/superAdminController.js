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
import axios from 'axios';
import { findSuperAdminByEmail, updateSuperAdminPassword,  getPlatformRevenueStats } from '../models/superAdminModel.js';
import pool from '../config/db.js';
import { getNotificationsByUser } from '../models/notificationModel.js';
import { saveOtp, verifyOtp, deleteOtp } from '../models/otpModel.js';
import { sendVerificationEmail } from '../utils/emailService.js';




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

    if (newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({
        success: false,
        error: "New password must be between 8 and 16 characters long"
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        error: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
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

    // 4. Total Exams (real count from exams table)
    const { rows: examsCount } = await pool.query(
      'SELECT COUNT(*) FROM exams'
    );
    const examsConducted = parseInt(examsCount[0].count, 10);

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
        totalExams: examsConducted,
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

export const updateSuperAdminProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const userId = req.user.id;

    // Full name validation (only letters and spaces)
    if (fullName) {
      const trimmedName = fullName.trim();
      const nameRegex = /^[A-Za-z ]+$/;
      if (!nameRegex.test(trimmedName)) {
        return res.status(400).json({
          success: false,
          error: "Full name must contain only letters and spaces"
        });
      }
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          error: "Full name must be between 2 and 100 characters"
        });
      }
    }

    // Phone number validation (optional, but strict Indian 10-digit if provided)
    let cleanedPhone = null;
    if (phone) {
      cleanedPhone = phone.replace(/[\s\-+]/g, '');
      const phoneRegex = /^[6789]\d{9}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        return res.status(400).json({
          success: false,
          error: "Phone number must be a valid 10-digit Indian number starting with 6-9 (e.g., 9876543210)"
        });
      }
    }

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
      values.push(cleanedPhone); // store clean version
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

export { superAdminLogin, superAdminChangePassword };

export const deleteAcademicAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM academic_admins WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Academic admin not found' });
    }

    res.json({ success: true, message: 'Academic admin deleted successfully' });
  } catch (error) {
    console.error('Delete academic admin error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete academic admin' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      'DELETE FROM courses WHERE id = $1 RETURNING id, name',
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Optional: Clean up related data (enrollments, schedules, etc.)
    // await pool.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);
    // etc.

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete course' });
  }
};

export const markSuperAdminNotificationAsRead = async (req, res) => {
  try {
    const superAdminId = req.user.id;
    const { notificationId } = req.params;

    if (!notificationId || isNaN(notificationId)) {
      return res.status(400).json({ success: false, error: 'Invalid notification ID' });
    }

    const { rowCount } = await pool.query(`
      UPDATE notifications
      SET status = 'read'
      WHERE id = $1
        AND recipient_type = 'superadmin'
        AND recipient_id = $2
        AND status = 'unread'
    `, [notificationId, superAdminId]);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found, already read, or not yours'
      });
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark superadmin notification read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Add near other exports (getDashboardStats, etc.)

export const getRevenueOverview = async (req, res) => {
  try {
    const stats = await getPlatformRevenueStats(pool);

    res.json({
      success: true,
      data: {
        totalRevenue: stats.totalRevenue,
        formattedTotal: stats.formattedTotal,              // e.g. ₹28.5L
        thisMonthRevenue: stats.currentMonthRevenue,
        formattedThisMonth: stats.formattedThisMonth,      // e.g. ₹3.2L
        percentageChange: stats.percentageChange,          // e.g. 12.5
        changeSign: stats.changeSign                       // '+' or ''
      }
    });
  } catch (error) {
    console.error('Get revenue overview error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch revenue data' });
  }
};

// NEW: Monthly revenue trend (last 12 months)
export const getMonthlyRevenueTrend = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(payment_timestamp, 'Mon YYYY') AS month,
        SUM(paid_amount) AS revenue
      FROM revenue
      WHERE payment_status = 'Completed'
        AND payment_timestamp >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(payment_timestamp, 'Mon YYYY'), 
               DATE_TRUNC('month', payment_timestamp)
      ORDER BY DATE_TRUNC('month', payment_timestamp) ASC
    `);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        month: row.month,
        revenue: parseFloat(row.revenue || 0)
      }))
    });
  } catch (error) {
    console.error('Monthly trend error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch monthly trend' });
  }
};

// NEW: Revenue by course
export const getRevenueByCourse = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.name AS course_name,
        SUM(r.paid_amount) AS revenue
      FROM revenue r
      JOIN courses c ON r.course_id = c.id
      WHERE r.payment_status = 'Completed'
      GROUP BY c.name
      ORDER BY revenue DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        name: row.course_name,
        value: parseFloat(row.revenue || 0),
        color: '#1e3a8a'  // you can make dynamic colors later
      }))
    });
  } catch (error) {
    console.error('Revenue by course error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course revenue' });
  }
};

// NEW: Revenue by academic centre (using graduation_university)
export const getRevenueByCentre = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        graduation_university AS centre,
        SUM(paid_amount) AS revenue
      FROM revenue
      WHERE payment_status = 'Completed'
      GROUP BY graduation_university
      ORDER BY revenue DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        centre: row.centre,
        revenue: parseFloat(row.revenue || 0)
      }))
    });
  } catch (error) {
    console.error('Revenue by centre error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch centre revenue' });
  }
};


// Validate credentials → generate ONE OTP → send same OTP to email + phone

export const superAdminSendDualOtp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Find superadmin
    const superAdmin = await findSuperAdminByEmail(pool, cleanEmail);
    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, superAdmin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 3. Generate one 6-digit OTP (same format as your phone OTP)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Store OTP in the phone OTP table (with user_type = superadmin)
    await saveOtp(superAdmin.phone, otp, 'superadmin');

    // 5. Send via SMS (MSG91) – same logic as otpController
    let smsSuccess = false;
    try {
      const smsResponse = await axios.post(
        'https://api.msg91.com/api/v5/otp',
        {
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: `91${superAdmin.phone}`,
          otp,
          sender: process.env.MSG91_SENDER_ID,
        },
        {
          headers: {
            authkey: process.env.MSG91_AUTH_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      smsSuccess = smsResponse.data?.type === 'success';
      if (!smsSuccess) {
        console.warn('MSG91 failed:', smsResponse.data);
      }
    } catch (smsErr) {
      console.error('MSG91 error:', smsErr.message);
    }

    // 6. Send via Email – force the **same** OTP
    let emailSuccess = false;
    try {
      emailSuccess = await sendVerificationEmail(cleanEmail, otp);
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    // 7. Masked values for frontend display
    const maskedEmail = cleanEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    const maskedPhone = superAdmin.phone?.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2') || 'not set';

    return res.status(200).json({
      success: true,
      message: 'OTP sent to registered email and phone',
      maskedEmail,
      maskedPhone,
      // Pass real values back so frontend can use them in verify step
      realEmail: cleanEmail,
      realPhone: superAdmin.phone,
    });
  } catch (err) {
    console.error('superAdminSendDualOtp error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP sending',
    });
  }
};

