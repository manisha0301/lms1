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

    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if email or mobile already exists
    const existingEmail = await findStudentByEmail(email);
    const existingMobile = await findStudentByMobile(mobileNumber);

    if (existingEmail) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }
    if (existingMobile) {
      return res.status(400).json({ success: false, error: "Mobile number already registered" });
    }

    // Create student
    const student = await createStudent({
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      graduationUniversity
    });

    // Notify academic admins of the student's graduation university
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
      }
    }

          // Notify faculty of this center
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
    
    // Generate JWT token
    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

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

    if ((!email && !mobileNumber) || !password) {
      return res.status(400).json({ success: false, error: "Email/Phone and password required" });
    }

    let student;
    if (email) {
      student = await findStudentByEmail(email);
    } else {
      student = await findStudentByMobile(mobileNumber);
    }

    if (!student) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // CORRECT: Use bcrypt.compare to check password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

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
    const { firstName, lastName, email, phone, university } = req.body;

    // Validate required fields (optional - you can make some optional)
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ success: false, error: 'First name, last name, email, and phone are required' });
    }

    // Check if email is already taken by someone else
    const { rows: emailCheck } = await pool.query(
      'SELECT id FROM students WHERE email = $1 AND id != $2',
      [email, studentId]
    );
    if (emailCheck.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already in use by another account' });
    }

    // Check phone uniqueness (optional)
    const { rows: phoneCheck } = await pool.query(
      'SELECT id FROM students WHERE mobile_number = $1 AND id != $2',
      [phone, studentId]
    );
    if (phoneCheck.length > 0) {
      return res.status(409).json({ success: false, error: 'Phone number already in use' });
    }

    const { rows } = await pool.query(`
      UPDATE students
      SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        mobile_number = $4,
        graduation_university = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING 
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        mobile_number AS phone,
        graduation_university AS university,
        created_at AS joinedDate
    `, [firstName, lastName, email, phone, university || null, studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Format joinedDate again
    const updated = rows[0];
    updated.joinedDate = new Date(updated.joinedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

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

// export const getAllCoursesForStudents = async (req, res) => {
//   try {
//     const { rows } = await pool.query(`
//       SELECT 
//         id,
//         title,
//         instructor_name,
//         duration,
//         price,
//         original_price,
//         batch_start_date,
//         is_live,
//         thumbnail_url
//       FROM courses
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       courses: rows
//     });

//   } catch (error) {
//     console.error("Fetch all courses error:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch courses" });
//   }
// };

// Change student password (mirrors superAdminChangePassword logic)
export const changeStudentPassword = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

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

    // Fetch current hashed password
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

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
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
    await pool.query(
      'UPDATE students SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, studentId]
    );

    console.log("Password updated for student ID:", studentId);

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