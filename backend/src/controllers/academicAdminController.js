// src/controllers/academicAdminController.js
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { createAcademicAdmin, findAllAcademicAdmins, updateAcademicAdminPassword } from '../models/academicAdminModel.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import { addNotificationForSuperAdmin } from '../models/notificationModel.js';
import { saveOtp } from '../models/otpModel.js';
import { sendVerificationEmail } from '../utils/emailService.js';

const getAllAcademicAdmins = async (req, res) => {
  try {
    const admins = await findAllAcademicAdmins(pool);
    res.json({
      success: true,
      academicAdmins: admins  
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
    // Required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, password, and confirm password are required"
      });
    }

    // Trim fullName early
    const trimmedFullName = (fullName || '').trim();

    // Name validation: only letters and spaces
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(trimmedFullName)) {
      return res.status(400).json({
        success: false,
        error: "Full name must contain only letters and spaces (no numbers, symbols, or special characters)"
      });
    }

    // Reasonable length for name
    if (trimmedFullName.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Full name is too short (minimum 2 characters)"
      });
    }
    if (trimmedFullName.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Full name is too long (maximum 100 characters)"
      });
    }

    // Password validation - 8–16 chars, upper, lower, number, special char
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match"
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        success: false,
        error: "Password must be between 8 and 16 characters long"
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // Email validation - strong format + block numeric-ending TLD
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address"
      });
    }

    // Block suspicious TLD ending with digit (e.g. .com678)
    const domainPart = trimmedEmail.split('@')[1] || '';
    const tld = domainPart.split('.').pop() || '';
    if (/\d$/.test(tld)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email domain – top-level domain cannot end with a number"
      });
    }

    // Mobile number - Indian format, exactly 10 digits starting with 6-9
    let cleanedMobile = null;
    if (mobile) {
      cleanedMobile = mobile.replace(/[\s\-+]/g, ''); // remove spaces, -, +
      const phoneRegex = /^[6789]\d{9}$/;
      if (!phoneRegex.test(cleanedMobile)) {
        return res.status(400).json({
          success: false,
          error: "Mobile number must be a valid 10-digit Indian number starting with 6-9 (e.g., 9876543210)"
        });
      }
    }

    
    // Proceed to create
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminData = {
      fullName: trimmedFullName,
      email: trimmedEmail,
      mobile: cleanedMobile,
      role: role || 'Academic Admin',
      academic_name: academicAdmins ? academicAdmins.trim() : '',
      passwordHash,
      twoFactor: !!twoFactor
    };

    const newAdmin = await createAcademicAdmin(pool, adminData);

    // Notification
    const notifyMessage = `New Academic Admin created: ${newAdmin.fullName} (${newAdmin.email})`;
    await addNotificationForSuperAdmin(
      pool,
      notifyMessage,
      'admin',          
      'medium'
    );

    res.status(201).json({
      success: true,
      message: "Academic Admin created successfully",
      admin: newAdmin
    });

  } catch (error) {
    console.error("Create Academic Admin Error →", error.message);

    if (error.code === '23505') { 
      return res.status(409).json({
        success: false,
        error: "Email already exists"
      });
    }

    res.status(500).json({ 
      success: false, 
      error: "Server error while creating academic admin" 
    });
  }
};

const academicAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Required fields check (more explicit)
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Password is required"
      });
    }

    // 2. Email format + TLD validation (exact match with frontend)
    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address"
      });
    }

    // Block TLD ending with digit (same as frontend)
    const domainPart = trimmedEmail.split('@')[1] || '';
    const tld = domainPart.split('.').pop() || '';
    if (/\d$/.test(tld)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email domain – top-level domain cannot end with a number"
      });
    }

    // 3. Password format + complexity validation (exact match with frontend)
    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        success: false,
        error: "Password must be between 8 and 16 characters long"
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // 4. Find admin (use trimmed email)
    const { rows } = await pool.query(
      `SELECT * FROM academic_admins WHERE email = $1 AND status = 'Active'`,
      [trimmedEmail]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials or account not active"
      });
    }

    // 5. Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // 6. Generate JWT (unchanged)
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "academicadmin",
        academic_name: admin.academic_name,
        fullName: admin.full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 7. Update last login
    await pool.query(
      `UPDATE academic_admins SET last_login = NOW() WHERE id = $1`,
      [admin.id]
    );

    // 8. Success response
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

  } catch (error) {
    console.error("Academic Admin Login Error →", error.message);
    res.status(500).json({
      success: false,
      error: "Server error during login"
    });
  }
};

const academicAdminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; 
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
    const adminId = req.user.id; 

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

    // Get the admin's academic_name (university)
    const { rows: adminInfo } = await pool.query(
      'SELECT academic_name FROM academic_admins WHERE id = $1',
      [adminId]
    );

    if (adminInfo.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const universityName = adminInfo[0].academic_name;

    // 1. Total Students in this university (filtered by graduation_university)
    const { rows: studentCount } = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM students 
      WHERE graduation_university ILIKE $1
    `, [`%${universityName}%`]); 

    const totalStudents = parseInt(studentCount[0].total || 0, 10);

    // 2. Total Assigned Courses for this admin
    const { rows: courses } = await pool.query(`
      SELECT c.id, c.name, c.price, c.description, c.teachers, c.created_at
      FROM courses c
      JOIN course_academic_assignments ca ON c.id = ca.course_id
      WHERE ca.academic_admin_id = $1
      ORDER BY c.created_at DESC
    `, [adminId]);

    const totalCourses = courses.length;

    // 3. Total Active Faculties for this admin
    const { rows: facultyCount } = await pool.query(`
      SELECT COUNT(*) AS total
      FROM faculty
      WHERE academic_admin_id = $1 AND status = 'Active'
    `, [adminId]);

    const totalFaculty = parseInt(facultyCount[0].total || 0, 10);

    res.json({ 
      success: true, 
      courses,
      stats: {
        totalStudents,
        totalCourses,
        totalFaculty
      }
    });
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
      SELECT 
    c.id, c.name, c.price, c.description, c.type, c.duration, c.image,
    w.id AS week_id, w.title AS week_title, w.week_number, w."order" AS week_order,
    m.id AS module_id, m.title AS module_name, m."order" AS module_order,
    mc.id AS content_id, mc.title AS content_title, mc.title AS content_data
    FROM courses c
    LEFT JOIN course_weeks w ON c.id = w.course_id
    LEFT JOIN course_modules m ON w.id = m.week_id
    LEFT JOIN module_contents mc ON m.id = mc.module_id
    JOIN course_academic_assignments ca ON c.id = ca.course_id
    WHERE ca.academic_admin_id = $1 
    AND c.id = $2
    `, [adminId, courseId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found or not assigned' });
    }

    res.json({ success: true, course: rows });
  } catch (error) {
    console.error('Get Course Details Error →', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all students enrolled in this admin's university
const getUniversityStudents = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Get the admin's university name
    const { rows: admin } = await pool.query(
      'SELECT academic_name FROM academic_admins WHERE id = $1',
      [adminId]
    );

    if (admin.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const university = admin[0].academic_name;

    // Fetch students where graduation_university matches 
    const { rows: students } = await pool.query(`
      SELECT 
        id,
        first_name || ' ' || last_name AS name,
        email,
        mobile_number AS phone,
        created_at AS joined_at
      FROM students
      WHERE graduation_university ILIKE $1
      ORDER BY created_at DESC
    `, [`%${university}%`]);

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Get university students error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
};

// Get a single student by ID (for admin view)
const getStudentByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT 
        id,
        student_id,
        first_name,
        last_name,
        email,
        mobile_number,
        graduation_university,
        created_at
      FROM students
      WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, student: rows[0] });
  } catch (error) {
    console.error('Get student by ID (admin) error:', error);
    res.status(500).json({ success: false, error: 'Failed to load student profile' });
  }
};

// Add at the bottom of academicAdminController.js

export const getAcademicAdminNotifications = async (req, res) => {
  try {
    const { limit } = req.query;
    const adminId = req.user.id;

    let query = `
      SELECT 
        id,
        message,
        type,
        priority,
        status,
        created_at::text AS created_at
      FROM notifications 
      WHERE recipient_type = 'academicadmin' 
        AND recipient_id = $1
      ORDER BY created_at DESC
    `;
    const values = [adminId];

    if (limit) {
      query += ' LIMIT $2';
      values.push(parseInt(limit, 10));
    }

    const { rows } = await pool.query(query, values);

    res.json({
      success: true,
      notifications: rows
    });
  } catch (error) {
    console.error('Get Academic Admin Notifications Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
};

export const getCourseStudentsWithProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { rows } = await pool.query(`
      SELECT 
        st.id,
        CONCAT(st.first_name, ' ' || st.last_name) AS name,
        st.email,
        st.mobile_number AS phone,
        COUNT(s.id) AS submitted_assignments
      FROM students st
      JOIN course_academic_assignments caa 
        ON caa.academic_admin_id = (
            SELECT academic_admin_id 
            FROM course_academic_assignments 
            WHERE course_id = $1 LIMIT 1
        )
      LEFT JOIN course_assessments a 
        ON a.course_id = $1
      LEFT JOIN assignment_submissions s 
        ON s.assignment_id = a.id 
        AND s.student_id = st.id
      GROUP BY st.id
    `, [courseId]);

    res.json({ success: true, students: rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const updateFacultyDetails = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { phone, address, designation, qualification } = req.body;

    const updates = {};
    if (phone !== undefined) updates.phone = phone ? phone.replace(/[\s\-+]/g, '') : null;
    if (address !== undefined) updates.address = address?.trim() || null;
    if (designation !== undefined) updates.designation = designation?.trim() || null;
    if (qualification !== undefined) updates.qualification = qualification?.trim() || null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: "No fields provided to update" });
    }

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = [...Object.values(updates), facultyId];

    const result = await pool.query(
      `UPDATE faculty 
       SET ${setClause}
       WHERE id = $${values.length}
       RETURNING id, phone, address, designation, qualification`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Faculty not found" });
    }

    res.json({ success: true, faculty: result.rows[0] });
  } catch (error) {
    console.error("Update faculty error:", error);
    res.status(500).json({ success: false, error: "Failed to update faculty" });
  }
};

// Mark a single notification as read for the logged-in admin
export const markAdminNotificationAsRead = async (req, res) => {
  try {
    const adminId = req.user.id; 
    const { notificationId } = req.params;

    if (!notificationId || isNaN(notificationId)) {
      return res.status(400).json({ success: false, error: 'Invalid notification ID' });
    }

    const { rowCount } = await pool.query(`
      UPDATE notifications
      SET status = 'read'
      WHERE id = $1
        AND recipient_type = 'academicadmin'
        AND recipient_id = $2
        AND status = 'unread'          -- only update if still unread
    `, [notificationId, adminId]);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found, already read, or not assigned to this admin'
      });
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark admin notification read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get dashboard stats with MoM percentage
export const getAdminDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Get the admin's academic_name (center/university)
    const { rows: adminRows } = await pool.query(
      'SELECT academic_name FROM academic_admins WHERE id = $1',
      [adminId]
    );

    if (adminRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const university = adminRows[0].academic_name?.trim();

    if (!university) {
      return res.status(400).json({ success: false, error: 'No university assigned to this admin' });
    }

    // Current month start/end 
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); 

    const currentStartStr = currentMonthStart.toISOString().split('T')[0];
    const prevStartStr = previousMonthStart.toISOString().split('T')[0];
    const prevEndStr = previousMonthEnd.toISOString().split('T')[0];

    // Total Students (all time) 
    const studentQuery = `
      SELECT 
        COUNT(*) AS total_students,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) AS current_month_new,
        COUNT(CASE WHEN created_at >= $2 AND created_at <= $3 THEN 1 END) AS prev_month_new
      FROM students
      WHERE graduation_university ILIKE $4
    `;
    const studentRes = await pool.query(studentQuery, [
      currentStartStr,
      prevStartStr,
      prevEndStr,
      `%${university}%`
    ]);

    const totalStudents = parseInt(studentRes.rows[0].total_students || 0);
    const currNewStudents = parseInt(studentRes.rows[0].current_month_new || 0);
    const prevNewStudents = parseInt(studentRes.rows[0].prev_month_new || 0);

    // MoM % change for students (based on new enrollments)
    const studentMoM = prevNewStudents === 0 
      ? (currNewStudents > 0 ? 100 : 0) 
      : ((currNewStudents - prevNewStudents) / prevNewStudents) * 100;

    // 2. Active Courses (assigned to this admin)
    const courseQuery = `
      SELECT 
        COUNT(*) AS total_courses,
        COUNT(CASE WHEN c.created_at >= $1 THEN 1 END) AS current_month_new,
        COUNT(CASE WHEN c.created_at >= $2 AND c.created_at <= $3 THEN 1 END) AS prev_month_new
      FROM courses c
      JOIN course_academic_assignments ca ON c.id = ca.course_id
      WHERE ca.academic_admin_id = $4
    `;
    const courseRes = await pool.query(courseQuery, [
      currentStartStr,
      prevStartStr,
      prevEndStr,
      adminId
    ]);

    const totalCourses = parseInt(courseRes.rows[0].total_courses || 0);
    const currNewCourses = parseInt(courseRes.rows[0].current_month_new || 0);
    const prevNewCourses = parseInt(courseRes.rows[0].prev_month_new || 0);

    const coursesMoM = prevNewCourses === 0 
      ? (currNewCourses > 0 ? 100 : 0) 
      : ((currNewCourses - prevNewCourses) / prevNewCourses) * 100;

    // 3. Faculty Members (active in this center)
    const facultyQuery = `
      SELECT 
        COUNT(*) AS total_faculty,
        COUNT(CASE WHEN created_at >= $1 THEN 1 END) AS current_month_new,
        COUNT(CASE WHEN created_at >= $2 AND created_at <= $3 THEN 1 END) AS prev_month_new
      FROM faculty
      WHERE academic_admin_id = $4 AND status = 'Active'
    `;
    const facultyRes = await pool.query(facultyQuery, [
      currentStartStr,
      prevStartStr,
      prevEndStr,
      adminId
    ]);

    const totalFaculty = parseInt(facultyRes.rows[0].total_faculty || 0);
    const currNewFaculty = parseInt(facultyRes.rows[0].current_month_new || 0);
    const prevNewFaculty = parseInt(facultyRes.rows[0].prev_month_new || 0);

    const facultyMoM = prevNewFaculty === 0 
      ? (currNewFaculty > 0 ? 100 : 0) 
      : ((currNewFaculty - prevNewFaculty) / prevNewFaculty) * 100;

    // Format percentages
    const formatPercent = (val) => {
      if (val > 0) return `+${Math.round(val)}%`;
      if (val < 0) return `${Math.round(val)}%`;
      return "0%";
    };

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalFaculty,
        studentGrowth: formatPercent(studentMoM),
        courseGrowth: formatPercent(coursesMoM),
        facultyGrowth: formatPercent(facultyMoM)
      }
    });

  } catch (error) {
    console.error('Get Admin Dashboard Stats Error:', error);
    res.status(500).json({ success: false, error: 'Failed to load dashboard stats' });
  }
};

export const academicAdminSendDualOtp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Find admin
    const { rows } = await pool.query(
      'SELECT id, email, password_hash, mobile, full_name, academic_name, status FROM academic_admins WHERE email = $1',
      [cleanEmail]
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (admin.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Account is not active' });
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check if phone exists
    if (!admin.mobile || admin.mobile.length < 10) {
      return res.status(400).json({ success: false, message: 'No registered phone number found' });
    }

    // 4. Generate ONE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Store OTP (against phone + user_type)
    await saveOtp(admin.mobile, otp, 'admin');  

    // 6. Send SMS (MSG91)
    let smsSuccess = false;
    try {
      const smsResponse = await axios.post(
        'https://api.msg91.com/api/v5/otp',
        {
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile: `91${admin.mobile}`,
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
    } catch (smsErr) {
      console.error('MSG91 SMS error:', smsErr.message);
    }

    // 7. Send Email (same OTP)
    let emailSuccess = false;
    try {
      emailSuccess = await sendVerificationEmail(cleanEmail, otp);
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    // Optional: fail if both failed
    if (!smsSuccess && !emailSuccess) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }

    // 8. Masked values for UI
    const maskedEmail = cleanEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    const maskedPhone = admin.mobile.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');

    return res.status(200).json({
      success: true,
      message: 'OTP sent to registered email and phone',
      maskedEmail,
      maskedPhone,
      realEmail: cleanEmail,
      realPhone: admin.mobile,
    });

  } catch (err) {
    console.error('academicAdminSendDualOtp error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Finalize login after OTP verify 

export const academicAdminFinalizeLogin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, mobile, academic_name, role, status 
       FROM academic_admins 
       WHERE email = $1 AND status = 'Active'`,
      [cleanEmail]
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Account not found or inactive' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "academicadmin",
        academic_name: admin.academic_name,
        fullName: admin.full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    //update last login
    await pool.query(
      'UPDATE academic_admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name || 'Academic Admin',
        role: "academicadmin",
        academic_name: admin.academic_name,
        phone: admin.mobile
      }
    });

  } catch (err) {
    console.error('academicAdminFinalizeLogin error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
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
  getCourseDetails,
  getUniversityStudents,
  getStudentByIdForAdmin,
 
};