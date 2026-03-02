// backend/src/controllers/studentController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import pool from '../config/db.js';
import {
  createStudent,
  findStudentByEmail,
  findStudentByMobile
} from '../models/studentModel.js';

import { addNotificationForAcademicAdmins } from '../models/notificationModel.js';

import { addNotificationForFaculties } from '../models/notificationModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'; 

const validateName = (name, field = 'Name') => {
  if (!name || typeof name !== 'string') return `${field} is required`;
  const trimmed = name.trim();
  if (trimmed.length < 2) return `${field} must be at least 2 characters`;
  if (trimmed.length > 50) return `${field} cannot exceed 50 characters`;
  if (!/^[A-Za-z ]+$/.test(trimmed)) return `${field} can only contain letters and spaces`;
  return null;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return 'Email is required';
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
  const tld = trimmed.split('@')[1]?.split('.').pop() || '';
  if (/\d$/.test(tld)) return 'Invalid email domain – top-level domain cannot end with a number';
  return null;
};

const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return 'Phone number is required';
  const cleaned = phone.replace(/[\s\-+]/g, '');
  if (cleaned.length !== 10) return 'Phone number must be exactly 10 digits';
  if (!/^[6789]\d{9}$/.test(cleaned)) return 'Phone must be a valid 10-digit Indian number starting with 6-9';
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 16) return 'Password must be between 8 and 16 characters long';
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
  if (!passwordRegex.test(password)) return 'Password must contain at least one uppercase, one lowercase, one number, and one special character';
  return null;
};

// Student Signup with enhanced validation and notifications
export const studentSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      graduationUniversity
    } = req.body;

    // 1. Basic required fields check (kept as-is)
    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // 2. Detailed validation (exact match to frontend Signup.jsx)
    let validationError = null;

    // Name validation (both first and last)
    const firstNameError = validateName(firstName, "First name");
    if (firstNameError) validationError = firstNameError;

    const lastNameError = validateName(lastName, "Last name");
    if (lastNameError) validationError = lastNameError;

    // Email validation
    const emailError = validateEmail(email);
    if (emailError) validationError = emailError;

    // Phone validation
    const phoneError = validatePhone(mobileNumber);
    if (phoneError) validationError = phoneError;

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) validationError = passwordError;

    // If any validation failed, return early
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // 3. Check if email or mobile already exists (your original logic)
    const existingEmail = await findStudentByEmail(email.trim().toLowerCase());
    const existingMobile = await findStudentByMobile(mobileNumber.trim());

    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        error: "This email address is already registered" 
      });
    }
    if (existingMobile) {
      return res.status(400).json({ 
        success: false, 
        error: "This mobile number is already registered" 
      });
    }

    // 4. Create student (your original logic)
    const student = await createStudent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      mobileNumber: mobileNumber.trim(),
      password, // plain text - will be hashed in createStudent
      graduationUniversity: graduationUniversity?.trim() || null
    });

    // 5. Notify academic admins (your original logic - unchanged)
    if (graduationUniversity && graduationUniversity.trim()) {
      const { rows: matchingAdmins } = await pool.query(
        `
        SELECT id 
        FROM academic_admins 
        WHERE LOWER(academic_name) LIKE LOWER($1)
          AND status = 'Active'
        `,
        [`%${graduationUniversity.trim()}%`]
      );

      if (matchingAdmins.length > 0) {
        const adminIds = matchingAdmins.map(a => a.id);

        const message = `New student enrolled: ${firstName} ${lastName} (${email}) in your center`;

        await addNotificationForAcademicAdmins(
          pool,
          message,
          'student',       // type
          'medium',
          adminIds
        );

        // Notify faculty of this center (your original logic - unchanged)
        try {
          const { rows: faculty } = await pool.query(`
            SELECT id 
            FROM faculty 
            WHERE academic_admin_id = ANY($1)
              AND status = 'Active'
          `, [adminIds]);

          const facultyIds = faculty.map(f => f.id);

          if (facultyIds.length > 0) {
            const studentName = `${firstName} ${lastName}`.trim() || 'A new student';
            const centerName = graduationUniversity.trim();

            const message = `${studentName} has joined your center (${centerName})`;

            await addNotificationForFaculties(
              pool,
              message,
              'student',
              'medium',
              facultyIds
            );
          }
        } catch (err) {
          console.error('Faculty notification failed on signup:', err.message);
        }
      }
    }

    // 6. Generate JWT token (your original logic - unchanged)
    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 7. Success response (your original structure - unchanged)
    res.status(201).json({
      success: true,
      message: "Student account created successfully",
      token,
      user: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        mobileNumber: student.mobile_number,
        graduationUniversity: student.graduation_university
      }
    });

  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// NEW: Student Login with proper password check
export const studentLogin = async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    // 1. Basic required fields check (your original logic - kept)
    if ((!email && !mobileNumber) || !password) {
      return res.status(400).json({ success: false, error: "Email/Phone and password required" });
    }

    // 2. Detailed validation (exact match to frontend Login.jsx)
    let validationError = null;

    // Validate identifier (email or phone)
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) validationError = emailError;
    } else if (mobileNumber) {
      const phoneError = validatePhone(mobileNumber);
      if (phoneError) validationError = phoneError;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) validationError = passwordError;

    // If any validation failed, return early
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // 3. Find student (your original logic)
    let student;
    if (email) {
      student = await findStudentByEmail(email.trim().toLowerCase());
    } else {
      student = await findStudentByMobile(mobileNumber.trim());
    }

    if (!student) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // 4. Verify password (your original logic)
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // 5. Generate token (your original logic)
    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 6. Success response (your original structure - unchanged)
    res.json({
      success: true,
      token,
      user: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        mobileNumber: student.mobile_number,
        graduationUniversity: student.graduation_university
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { rows: studentRows } = await pool.query(
      'SELECT graduation_university FROM students WHERE id = $1',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const university = studentRows[0].graduation_university?.trim();

    if (!university) {
      return res.json({ success: true, courses: [] });
    }

    // FIX: status = 'Active', not university name
    const { rows: adminRows } = await pool.query(
      'SELECT id FROM academic_admins WHERE academic_name = $1 AND status = $2',
      [university, 'Active']
    );

    if (adminRows.length === 0) {
      return res.json({ success: true, courses: [] });
    }

    const academicAdminId = adminRows[0].id;

    const { rows: courseRows } = await pool.query(`
      SELECT 
        c.id,
        c.name AS title,
        c.duration,
        c.price,
        c.teachers AS teacher_ids,
        c.image
      FROM courses c
      JOIN course_academic_assignments caa ON c.id = caa.course_id
      WHERE caa.academic_admin_id = $1
    `, [academicAdminId]);

    const courses = [];
    for (const course of courseRows) {
      let instructors = "No faculty assigned";
      if (course.teacher_ids && course.teacher_ids.length > 0) {
        const { rows: facultyRows } = await pool.query(
          'SELECT full_name FROM faculty WHERE id = ANY($1)',
          [course.teacher_ids]
        );
        instructors = facultyRows.map(f => f.full_name).join(", ");
      }

      courses.push({
        id: course.id,
        title: course.title,
        instructor: instructors,
        duration: course.duration || "N/A",
        price: course.price || 0,
        progress: Math.floor(Math.random() * 101),
        thumbnail: course.image 
      });
    }

    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get logged-in student profile (protected)
export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT (protectStudent middleware)

    const { rows } = await pool.query(`
      SELECT 
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        mobile_number AS phone,
        graduation_university AS university,
        TO_CHAR(created_at, 'YYYY-MM-DD') AS "joinedDate"
      FROM students
      WHERE id = $1
    `, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const student = rows[0];

    // Format joined date nicely
    student.joinedDate = new Date(student.joinedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    res.json({
      success: true,
      profile: student
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to load profile' });
  }
};

// Update student profile (protected)
export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { firstName, lastName, email, phone } = req.body;

    // 1. Required fields check (your original logic - kept)
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, error: 'First name, last name, email, and phone are required' });
    }

    // 2. Detailed validation (exact match to frontend ProfileDashboard.jsx)
    let validationError = null;

    // Name validation (both first and last)
    const firstNameError = validateName(firstName, "First name");
    if (firstNameError) validationError = firstNameError;

    const lastNameError = validateName(lastName, "Last name");
    if (lastNameError) validationError = lastNameError;

    // Email validation
    const emailError = validateEmail(email);
    if (emailError) validationError = emailError;

    // Phone validation
    const phoneError = validatePhone(phone);
    if (phoneError) validationError = phoneError;

    // If any validation failed, return early
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // 3. Check if email is already taken by someone else (your original logic)
    const { rows: emailCheck } = await pool.query(
      'SELECT id FROM students WHERE email = $1 AND id != $2',
      [email.trim().toLowerCase(), studentId]
    );
    if (emailCheck.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already in use by another account' });
    }

    // 4. Check phone uniqueness (your original logic)
    const { rows: phoneCheck } = await pool.query(
      'SELECT id FROM students WHERE mobile_number = $1 AND id != $2',
      [phone.trim(), studentId]
    );
    if (phoneCheck.length > 0) {
      return res.status(409).json({ success: false, error: 'Phone number already in use' });
    }

    // 5. Update profile (your original query - only trimmed values passed)
    const { rows } = await pool.query(`
      UPDATE students
      SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        mobile_number = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING 
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        mobile_number AS phone,
        graduation_university AS university,
        created_at AS joinedDate
    `, [firstName.trim(), lastName.trim(), email.trim().toLowerCase(), phone.trim(), studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // 6. Format joinedDate (your original logic - unchanged)
    const updated = rows[0];
    updated.joinedDate = new Date(updated.joinedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 7. Success response (your original structure - unchanged)
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updated
    });

  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

// Get upcoming classes for logged-in student (based on university → admin → courses)
export const getStudentUpcomingClasses = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get student's university
    const { rows: studentRows } = await pool.query(
      'SELECT graduation_university FROM students WHERE id = $1',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.json({ success: true, upcomingClasses: [] });
    }

    const university = studentRows[0].graduation_university?.trim();
    if (!university) {
      return res.json({ success: true, upcomingClasses: [] });
    }

    // 2. Find matching academic admin
    const { rows: adminRows } = await pool.query(
      'SELECT id FROM academic_admins WHERE academic_name ILIKE $1 AND status = $2 LIMIT 1',
      [`%${university}%`, 'Active']
    );

    if (adminRows.length === 0) {
      return res.json({ success: true, upcomingClasses: [] });
    }

    const adminId = adminRows[0].id;

    // 3. Get all courses assigned to this admin
    const { rows: courseRows } = await pool.query(`
      SELECT 
        c.id AS course_id,
        c.name AS title,
        c.teachers
      FROM courses c
      JOIN course_academic_assignments caa ON c.id = caa.course_id
      WHERE caa.academic_admin_id = $1
    `, [adminId]);

    if (courseRows.length === 0) {
      return res.json({ success: true, upcomingClasses: [] });
    }

    const courseIds = courseRows.map(c => c.course_id);

    // 4. Get future/today schedules for these courses
    const { rows: schedules } = await pool.query(`
      SELECT 
        s.course_id,
        s.start_date,
        s.end_date,
        s.start_time,
        s.end_time,
        s.meeting_link
      FROM academic_course_schedules s
      WHERE s.course_id = ANY($1::int[])
        AND s.end_date >= CURRENT_DATE
      ORDER BY s.start_date ASC, s.start_time ASC
    `, [courseIds]);

    // 5. Build faculty name map (all teachers across courses)
    const allTeacherIds = new Set();
    courseRows.forEach(c => {
      if (c.teachers) c.teachers.forEach(id => allTeacherIds.add(id));
    });

    let teacherMap = {};
    if (allTeacherIds.size > 0) {
      const { rows: teachers } = await pool.query(
        'SELECT id, full_name FROM faculty WHERE id = ANY($1)',
        [Array.from(allTeacherIds)]
      );
      teacherMap = Object.fromEntries(teachers.map(t => [t.id, t.full_name]));
    }

    // 6. Generate daily class entries
    const upcomingClasses = [];

    for (const sched of schedules) {
      const course = courseRows.find(c => c.course_id === sched.course_id);
      if (!course) continue;

      const facultyNames = (course.teachers || [])
        .map(id => teacherMap[id])
        .filter(Boolean)
        .join(', ') || 'TBD';

      let currentDate = new Date(sched.start_date);
      const endDate = new Date(sched.end_date);

      while (currentDate <= endDate) {
        upcomingClasses.push({
          id: `${sched.course_id}-${currentDate.toISOString().split('T')[0]}`,
          title: course.title,
          datetime: `${sched.start_time?.slice(0,5)} – ${sched.end_time?.slice(0,5)}`,
          instructor: facultyNames,
          date: currentDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
          }),
          rawDate: currentDate.toISOString().split('T')[0]
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Sort by date
    upcomingClasses.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Optional: limit to reasonable number (e.g., next 30 days)
    const maxDays = 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + maxDays);
    const limited = upcomingClasses.filter(cls => new Date(cls.date) <= cutoff);

    res.json({
      success: true,
      upcomingClasses: limited
    });
  } catch (error) {
    console.error('Student upcoming classes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch upcoming classes' });
  }
};

export const getStudentNotifications = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { limit = 20 } = req.query;

    const { rows } = await pool.query(`
      SELECT 
        id, message, type, priority, status, 
        created_at::text AS created_at
      FROM notifications
      WHERE recipient_type = 'student' 
        AND recipient_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [studentId, Number(limit)]);

    res.json({ success: true, notifications: rows });
  } catch (err) {
    console.error('Get student notifications error:', err);
    res.status(500).json({ success: false, error: 'Failed to load notifications' });
  }
};

export const getStudentAssignmentProgress = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1️⃣ Get student's university
    const { rows: studentRows } = await pool.query(
      'SELECT graduation_university FROM students WHERE id = $1',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.json({
        success: true,
        totalAssignments: 0,
        submittedAssignments: 0,
        pendingAssignments: 0,
        progressPercent: 0
      });
    }

    const university = studentRows[0].graduation_university?.trim();

    if (!university) {
      return res.json({
        success: true,
        totalAssignments: 0,
        submittedAssignments: 0,
        pendingAssignments: 0,
        progressPercent: 0
      });
    }

    // 2️⃣ Get academic admin of that university
    const { rows: adminRows } = await pool.query(
      `SELECT id 
       FROM academic_admins 
       WHERE academic_name ILIKE $1 AND status = 'Active'
       LIMIT 1`,
      [`%${university}%`]
    );

    if (adminRows.length === 0) {
      return res.json({
        success: true,
        totalAssignments: 0,
        submittedAssignments: 0,
        pendingAssignments: 0,
        progressPercent: 0
      });
    }

    const adminId = adminRows[0].id;

    // 3️⃣ Get courses under that admin
    const { rows: courseRows } = await pool.query(
      `SELECT course_id 
       FROM course_academic_assignments
       WHERE academic_admin_id = $1`,
      [adminId]
    );

    if (courseRows.length === 0) {
      return res.json({
        success: true,
        totalAssignments: 0,
        submittedAssignments: 0,
        pendingAssignments: 0,
        progressPercent: 0
      });
    }

    const courseIds = courseRows.map(c => c.course_id);

    // 4️⃣ Count total assignments for those courses
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*) 
       FROM course_assessments
       WHERE course_id = ANY($1::int[])`,
      [courseIds]
    );

    const totalAssignments = parseInt(totalRows[0].count, 10);

    // 5️⃣ Count submitted assignments by this student
    const { rows: submittedRows } = await pool.query(
      `SELECT COUNT(*) 
       FROM assignment_submissions s
       JOIN course_assessments a ON s.assignment_id = a.id
       WHERE s.student_id = $1
         AND a.course_id = ANY($2::int[])`,
      [studentId, courseIds]
    );

    const submittedAssignments = parseInt(submittedRows[0].count, 10);

    const pendingAssignments = totalAssignments - submittedAssignments;

    const progressPercent =
      totalAssignments > 0
        ? Math.round((submittedAssignments / totalAssignments) * 100)
        : 0;

    res.json({
      success: true,
      totalAssignments,
      submittedAssignments,
      pendingAssignments,
      progressPercent
    });

  } catch (error) {
    console.error('Student assignment progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate assignment progress'
    });
  }
};


// Change student password (mirrors superAdminChangePassword logic)
export const changeStudentPassword = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1. Required fields validation (improved messages)
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password, new password, and confirm password are all required"
      });
    }

    // 2. Validate new password strength (exact match to frontend rules)
    const newPassError = validatePassword(newPassword);
    if (newPassError) {
      return res.status(400).json({
        success: false,
        error: newPassError
      });
    }

    // 3. Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New password and confirm password do not match"
      });
    }

    // 4. Optional: Validate current password has minimum length (prevents empty/weak attempts)
    if (currentPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Current password must be at least 8 characters long"
      });
    }

    // 5. Fetch current hashed password (your original logic)
    const { rows } = await pool.query(
      'SELECT password FROM students WHERE id = $1',
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    console.log("Rows fetched for password change:", rows);

    const storedHash = rows[0].password;

    // 6. Verify current password (your original logic)
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }

    // 7. Hash new password (your original logic)
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 8. Update password (your original logic)
    await pool.query(
      'UPDATE students SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, studentId]
    );

    console.log("Password updated for student ID:", studentId);

    // 9. Success response (your original structure - unchanged)
    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Student Change Password Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Permanently delete student account
export const deleteStudentAccount = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { rowCount } = await pool.query(
      'DELETE FROM students WHERE id = $1',
      [studentId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Account deleted permanently'
    });

  } catch (error) {
    console.error('Delete student account error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Student submits ratings for a course (1–5 stars)
export const submitCourseRating = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, rating } = req.body;

    if (!courseId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Course ID and valid rating (1–5) are required"
      });
    }

    // 1. Get student's university
    const { rows: studentRows } = await pool.query(
      'SELECT graduation_university FROM students WHERE id = $1',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const university = studentRows[0].graduation_university?.trim();
    if (!university) {
      return res.status(400).json({ success: false, error: "Your university is not set" });
    }

    // 2. Get academic admin ID for this student's university
    const { rows: adminRows } = await pool.query(
      'SELECT id FROM academic_admins WHERE academic_name ILIKE $1 AND status = $2 LIMIT 1',
      [`%${university}%`, 'Active']
    );

    if (adminRows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "No active center found for your university"
      });
    }

    const academicAdminId = adminRows[0].id;

    // 3. Check if this course is assigned to the student's center
    const { rows: assignmentCheck } = await pool.query(
      'SELECT 1 FROM course_academic_assignments WHERE course_id = $1 AND academic_admin_id = $2',
      [courseId, academicAdminId]
    );

    if (assignmentCheck.length === 0) {
      return res.status(403).json({
        success: false,
        error: "This course is not available in your university/center"
      });
    }

    // 4. Upsert rating
    const { rows } = await pool.query(
      `INSERT INTO ratings (academic_admin_id, student_id, course_id, rating)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, course_id)
       DO UPDATE SET 
         rating = EXCLUDED.rating,
         created_at = CURRENT_TIMESTAMP
       RETURNING id, rating, created_at`,
      [academicAdminId, studentId, courseId, rating]
    );

    res.json({
      success: true,
      message: "Rating submitted successfully",
      rating: rows[0]
    });

  } catch (error) {
    console.error('Submit rating error:', error.message);
    res.status(500).json({ success: false, error: "Failed to submit rating" });
  }
};

// Get the logged-in student's rating for a specific course
export const getMyCourseRating = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const { rows } = await pool.query(
      `SELECT rating 
       FROM ratings 
       WHERE student_id = $1 AND course_id = $2`,
      [studentId, courseId]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        rating: null  // User hasn't rated yet
      });
    }

    res.json({
      success: true,
      rating: rows[0].rating
    });
  } catch (error) {
    console.error('Get my rating error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch your rating' });
  }
};

// NEW: Simple endpoint to check if email is already taken (called before sending OTP)
export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Required field check (improved message)
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        available: false,
        message: "Email is required"
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Validate email format (exact match to frontend Signup.jsx)
    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      return res.status(400).json({
        success: false,
        available: false,
        message: emailError
      });
    }

    // 3. Check if email exists (your original logic - unchanged)
    const existing = await findStudentByEmail(trimmedEmail);

    // 4. Success response (your original structure - unchanged)
    res.json({
      success: true,
      available: !existing,
      message: existing ? "This email address is already registered" : "Email available"
    });

  } catch (error) {
    console.error('Check email availability error:', error.message);
    res.status(500).json({
      success: false,
      available: false,
      message: "Server error while checking email"
    });
  }
};