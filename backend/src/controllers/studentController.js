// backend/src/controllers/studentController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import pool from '../config/db.js';
import {
  createStudent,
  findStudentByEmail,
  findStudentByMobile
} from '../models/studentModel.js';

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