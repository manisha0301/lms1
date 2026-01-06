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
    const fullName = (req.body.fullName || req.body.firstName && req.body.lastName 
      ? `${req.body.firstName} ${req.body.lastName}` 
      : 'faculty').trim();

    let slug = fullName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

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
      designation, qualification, employmentStatus, password
    } = req.body;

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
      status: 'Active'  // Admin bypasses approval
    });

    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('Create faculty error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to add faculty' });
  }
};

// Get all faculties (active + pending for counts)
export const getFacultyList = async (req, res) => {
  try {
    const allFaculties = await getAllFacultyWithStatus();
    const pending = await getPendingFaculty();
    const active = allFaculties.filter(f => f.status === 'Active');

    res.json({
      success: true,
      faculties: active,
      pendingRequests: pending,
      stats: {
        total: allFaculties.length,
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
      employmentStatus
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
      status: 'Pending'  // Self-signup always pending approval
    });

    res.status(201).json({
      success: true,
      message: 'Signup successful! Your account is pending admin approval.',
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
      { expiresIn: '7d' }
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