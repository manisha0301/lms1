// backend/src/controllers/facultyController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import {
  addFaculty,
  getAllFaculty,
  getPendingFaculty,
  getAllFacultyWithStatus,
  approveFaculty,
  rejectFaculty,
  updateFaculty,
  deleteFaculty
} from '../models/facultyModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getCourseById, getCourseStructure } from '../models/courseModel.js';
import { addNotificationForAcademicAdmins } from '../models/notificationModel.js';

// Ensure uploads/faculty folder exists
const uploadDir = path.join(process.cwd(), 'uploads/faculty');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads/faculty folder');
}

// Multer storage - clean filename using full name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Prefer fullName from body (admin form sends this)
    let fullName = req.body.fullName || '';

    // If fullName not present, fallback to firstName + lastName (for other forms)
    if (!fullName && req.body.firstName && req.body.lastName) {
      fullName = `${req.body.firstName} ${req.body.lastName}`;
    }

    // Ultimate fallback
    if (!fullName.trim()) {
      fullName = 'faculty';
    }

    let slug = fullName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')           // spaces to -
      .replace(/[^a-z0-9-]/g, '')     // remove special chars
      .replace(/-+/g, '-')            // multiple - to single
      .replace(/^-|-$/g, '');         // remove leading/trailing -

    if (!slug) slug = 'faculty';

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';

    let filename = `${slug}${ext}`;
    let finalName = filename;
    let counter = 1;

    while (fs.existsSync(path.join(uploadDir, finalName))) {
      finalName = `${slug}-${counter}${ext}`;
      counter++;
    }

    cb(null, finalName);
  }
});

const upload = multer({ storage });
export const uploadProfilePic = upload.single('profilePicture');

// Admin adds faculty → directly Active
export const createFaculty = async (req, res) => {
  try {
    const {
      fullName, email, phone, address,
      designation, qualification, employmentStatus, password,
      academicAdminId   // ← NEW: Get academic admin ID from request body
    } = req.body;

    console.log('Logged in user ID (req.user.id):', req.user?.id);
    console.log('Received academicAdminId from form:', academicAdminId);

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const profile_picture = req.file ? req.file.filename : null;

    const newFaculty = await addFaculty({
      full_name: fullName,
      email,
      phone,
      address,
      designation,
      qualification,
      employment_status: employmentStatus,
      password_hash,
      profile_picture,
      status: 'Active',  // Admin bypasses approval
      academic_admin_id: academicAdminId || req.user.id  // ← NEW: Set the admin ID
    });

    //Notify the Academic Admin this faculty belongs to

    const targetAdminId = academicAdminId || req.user.id;

    if (targetAdminId) {
      const message = `New faculty joined: ${newFaculty.full_name} (${newFaculty.designation || 'Faculty'})`;

      await addNotificationForAcademicAdmins(
        pool,
        message,
        'faculty',       // notification type
        'medium',        // priority
        [targetAdminId]  // only this one admin gets notified
      );
    }

    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('Create faculty error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to add faculty' });
  }
};

// Get all faculties (active + pending for counts) - FILTERED by current admin
export const getFacultyList = async (req, res) => {
  try {
    const currentAdminId = req.user.id; // Logged-in Academic Admin ID

    // Fetch ALL faculties with status (for counts)
    const allFaculties = await getAllFacultyWithStatus();

    // Fetch ONLY faculties assigned to THIS admin
    const { rows: myFaculties } = await pool.query(`
      SELECT 
        id, code, full_name AS name, email, phone, address,
        designation, qualification, employment_status,
        profile_picture, status, created_at
      FROM faculty
      WHERE academic_admin_id = $1
      ORDER BY created_at DESC
    `, [currentAdminId]);

    // Pending requests - filtered by current admin
    const { rows: pending } = await pool.query(`
      SELECT 
        id, code, full_name AS name, email, phone,
        designation, qualification
      FROM faculty
      WHERE status = 'Pending' AND academic_admin_id = $1
      ORDER BY created_at DESC
    `, [currentAdminId]);

    // Active faculties = only mine
    const active = myFaculties.filter(f => f.status === 'Active');

    res.json({
      success: true,
      faculties: active,           // ← Only this admin's active faculties
      pendingRequests: pending,    // ← Only this admin's pending requests
      stats: {
        total: myFaculties.length, // ← Total under this admin
        active: active.length,
        pending: pending.length
      }
    });
  } catch (error) {
    console.error('Get faculty list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch faculties' });
  }
};

// Approve pending faculty
export const approvePendingFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const approverId = req.user.id;

    if (!facultyId) {
      return res.status(400).json({ success: false, error: 'Faculty ID required' });
    }

    const approved = await approveFaculty(facultyId, approverId);

    if (!approved) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    res.json({ success: true, faculty: approved, message: 'Faculty approved successfully' });
  } catch (error) {
    console.error('Approve faculty error:', error);
    res.status(500).json({ success: false, error: 'Failed to approve faculty' });
  }
};

// Reject pending faculty
export const rejectPendingFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    if (!facultyId) {
      return res.status(400).json({ success: false, error: 'Faculty ID required' });
    }

    const rejected = await rejectFaculty(facultyId);

    if (!rejected) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    res.json({ success: true, faculty: rejected, message: 'Faculty rejected' });
  } catch (error) {
    console.error('Reject faculty error:', error);
    res.status(500).json({ success: false, error: 'Failed to reject faculty' });
  }
};

// Update faculty
export const updateFacultyDetails = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const updates = req.body;

    if (!facultyId) {
      return res.status(400).json({ success: false, error: 'Faculty ID required' });
    }

    const updated = await updateFaculty(facultyId, updates);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    res.json({ success: true, faculty: updated });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ success: false, error: 'Failed to update faculty' });
  }
};

// Delete faculty
export const deleteFacultyMember = async (req, res) => {
  try {
    const { facultyId } = req.params;

    if (!facultyId) {
      return res.status(400).json({ success: false, error: 'Faculty ID required' });
    }

    const deleted = await deleteFaculty(facultyId);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete faculty' });
  }
};

// Faculty Self-Signup → always Pending
export const facultySignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      designation,
      qualification,
      shortCV,
      linkedinUrl,
      instagramUrl,
      facebookUrl,
      password,
      employmentStatus,
      university   // ← Changed: Now receiving university NAME from frontend
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, error: 'First name, last name, email, and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    const { rows: existing } = await pool.query('SELECT id FROM faculty WHERE email = $1', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const full_name = `${firstName.trim()} ${lastName.trim()}`;
    const profile_picture = req.file ? req.file.filename : null;

    // NEW: Map university name to actual academic admin ID
    let assignedAdminId = null;
    if (university && university.trim()) {
      const { rows } = await pool.query(
        `SELECT id FROM academic_admins 
         WHERE academic_name ILIKE $1 AND status = 'Active' 
         LIMIT 1`,
        [`%${university.trim()}%`]
      );
      if (rows.length > 0) {
        assignedAdminId = rows[0].id;
      }
    }

    const newFaculty = await addFaculty({
      full_name,
      email: email.toLowerCase(),
      phone,
      address,
      designation,
      qualification,
      employment_status: employmentStatus || 'Employed',
      password_hash,
      profile_picture,
      status: 'Pending',  // Self-signup always pending approval
      academic_admin_id: assignedAdminId  // ← Now correctly mapped from university name
    });


    // NEW: Notify the matching Academic Admin(s) for approval
    // ────────────────────────────────────────────────────────────────
    let targetAdminIds = [];

    // If we found a matching admin from university name
    if (assignedAdminId) {
      targetAdminIds = [assignedAdminId];
    } else {
      // Fallback: If no university match, notify ALL active admins (or none)
      // Option: Broadcast to all active admins (recommended for MVP)
      targetAdminIds = await getAllActiveAcademicAdminIds(pool);
    }

    if (targetAdminIds.length > 0) {
      const message = `New faculty approval request: ${full_name} (${email}) is awaiting your approval`;

      await addNotificationForAcademicAdmins(
        pool,
        message,
        'faculty_request',   // Special type so you can style it differently (e.g., yellow/orange)
        'high',              // High priority — needs action soon
        targetAdminIds
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Signup successful! Your account is pending approval.',
      faculty: newFaculty
    });
  } catch (error) {
    console.error('Faculty signup error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
};

// Faculty Login
export const facultyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const { rows } = await pool.query('SELECT * FROM faculty WHERE email = $1', [email.toLowerCase()]);
    const faculty = rows[0];

    if (!faculty) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, faculty.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (faculty.status === 'Pending') {
      return res.status(403).json({ success: false, error: 'Your account is pending approval' });
    }

    if (faculty.status === 'Rejected') {
      return res.status(403).json({ success: false, error: 'Your account was not approved' });
    }

    const token = jwt.sign(
      { id: faculty.id, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      faculty: {
        id: faculty.id,
        name: faculty.full_name,
        email: faculty.email,
        code: faculty.code,
        profilePicture: faculty.profile_picture
      }
    });
  } catch (error) {
    console.error('Faculty login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Get dashboard data for logged-in faculty
export const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id; // from JWT

    // Fetch faculty details (name, designation)
    const { rows: facultyRows } = await pool.query(
      'SELECT full_name, designation FROM faculty WHERE id = $1',
      [facultyId]
    );

    if (facultyRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    const faculty = facultyRows[0];

    // Fetch courses where this faculty is in the teachers array
    const { rows: courses } = await pool.query(`
      SELECT 
        id, 
        name AS title, 
        image AS thumbnail,
        type,
        price,
        teachers,
        COALESCE(created_at, CURRENT_TIMESTAMP) as created_at
      FROM courses 
      WHERE $1 = ANY(teachers)
      ORDER BY created_at DESC
    `, [facultyId]);

    // Fetch teacher names for all courses
    const allTeacherIds = new Set();
    courses.forEach(course => {
      if (course.teachers && Array.isArray(course.teachers)) {
        course.teachers.forEach(id => allTeacherIds.add(id));
      }
    });

    let facultyMap = {};
    if (allTeacherIds.size > 0) {
      const { rows: faculties } = await pool.query(
        'SELECT id, full_name FROM faculty WHERE id = ANY($1)',
        [Array.from(allTeacherIds)]
      );
      facultyMap = Object.fromEntries(faculties.map(f => [f.id, f.full_name]));
    }

    // Add teacher names to each course
    courses.forEach(course => {
      if (course.teachers && course.teachers.length > 0) {
        course.facultyNames = course.teachers
          .map(id => facultyMap[id] || 'Unknown Faculty')
          .filter(name => name !== 'Unknown Faculty'); // Remove unknown ones
      } else {
        course.facultyNames = [];
      }
      // Format created_at date
      if (course.created_at) {
        course.created_at = new Date(course.created_at).toISOString();
      }
      delete course.teachers; 
    });

    res.json({
      success: true,
      dashboard: {
        totalCourses: courses.length,
        recentCourses: courses.slice(0, 10), 
        faculty: {
          name: faculty.full_name,
          designation: faculty.designation || 'Faculty Member',
        }
      }
    });
  } catch (error) {
    console.error('Get faculty dashboard error:', error);
    res.status(500).json({ success: false, error: 'Failed to load dashboard' });
  }
};

// Get detailed course info for a faculty (protected)
export const getCourseDetails = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ success: false, error: 'Course ID required' });
    }

    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Ensure this faculty teaches this course
    if (!course.teachers || !Array.isArray(course.teachers) || !course.teachers.includes(facultyId)) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this course' });
    }

    const contents = await getCourseStructure(course.id);
    course.contents = contents;

    //get course schedule for this course in this admin from academic_course_schedules table
    const { rows: scheduleRows } = await pool.query(`
      SELECT id, academic_admin_id, start_date, end_date, start_time, end_time, meeting_link
      FROM academic_course_schedules
      WHERE course_id = $1
    `, [course.id]);
    course.schedules = scheduleRows;

    //get assessments for this course
    const { rows: assessmentRows } = await pool.query(`
      SELECT id, week_id, title, description, pdf_path, total_marks, due_date, created_at
      FROM course_assessments
      WHERE course_id = $1
    `, [course.id]);
    course.assessments = assessmentRows;

    // Optionally shape data for client
    res.json({ success: true, course, schedules: course.schedules, assessments: course.assessments });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch course details' });
  }
};

// Get logged-in faculty profile
export const getFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Get faculty basic info
    const { rows: facultyRows } = await pool.query(`
      SELECT 
        id,
        code,
        full_name,
        email,
        phone,
        address,
        designation,
        qualification,
        profile_picture,
        created_at AS joining_date
      FROM faculty 
      WHERE id = $1 AND status = 'Active'
    `, [facultyId]);

    if (facultyRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const faculty = facultyRows[0];

    // Get courses taught by this faculty
    const { rows: courseRows } = await pool.query(`
      SELECT id, name, type
      FROM courses 
      WHERE $1 = ANY(teachers)
      ORDER BY created_at DESC
    `, [facultyId]);

    
    const totalClasses = courseRows.length * 10; 
    const totalStudents = courseRows.length * 15; 

    res.json({
      success: true,
      profile: {
        ...faculty,
        employeeId: faculty.code,
        coursesTeaching: courseRows.map(c => `${c.name} (${c.type})`),
        totalClasses,
        totalStudents
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to load profile' });
  }
};

// Update faculty profile
export const updateFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { full_name, phone, designation, qualification } = req.body;

    const profile_picture = req.file ? req.file.filename : null;

    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone) updates.phone = phone;
    if (designation) updates.designation = designation;
    if (qualification) updates.qualification = qualification;
    if (profile_picture) updates.profile_picture = profile_picture;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No data to update' });
    }

    const { rows } = await pool.query(`
      UPDATE faculty 
      SET ${Object.keys(updates).map((k, i) => `${k} = $${i + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${Object.keys(updates).length + 1}
      RETURNING code, full_name, email, phone, designation, qualification, profile_picture, created_at AS joining_date
    `, [...Object.values(updates), facultyId]);

    res.json({
      success: true,
      profile: rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};