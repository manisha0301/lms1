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