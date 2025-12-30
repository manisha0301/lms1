// src/routes/superAdminRoutes.js
import express from 'express';
import { getDashboardStats, superAdminChangePassword, superAdminLogin } from '../controllers/superAdminController.js';
import {protectSuperAdmin} from '../middleware/authMiddleware.js';
import { createNewAcademicAdmin, getAllAcademicAdmins } from '../controllers/academicAdminController.js';

// Course controller import - CLEAN SEGREGATION
import { 
  createCourse, 
  getCourses, 
  getCourse, 
  updateContents,
  getAcademicAdminsForAssign,
  assignCourseToAdmins,
  getCourseAssignments
} from '../controllers/courseController.js';

// Multer setup for image upload
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // ← ADDED FOR FILE SYSTEM OPERATIONS

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto-create uploads folder if not exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads folder');
}

// Multer configuration - CLEAN MEANINGFUL FILENAMES
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const courseName = (req.body.name || 'course').trim();

    // Create clean slug from course name
    let slug = courseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')      // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, '');         // trim - from start/end

    if (!slug) slug = 'course';

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    let filename = `${slug}${ext}`;

    // Handle duplicates: add -1, -2, etc.
    let counter = 1;
    let finalName = filename;
    while (fs.existsSync(path.join(uploadDir, finalName))) {
      finalName = `${slug}-${counter}${ext}`;
      counter++;
    }

    cb(null, finalName);
  }
});

const upload = multer({ storage });

const router = express.Router();

// Existing Super Admin routes
router.post('/login', superAdminLogin);
router.post('/change-password', protectSuperAdmin, superAdminChangePassword);
router.get('/stats', protectSuperAdmin, getDashboardStats); 

// Existing Academic Admin routes
router.get('/academic-admins', protectSuperAdmin, getAllAcademicAdmins);
router.post('/academic-admins', protectSuperAdmin, createNewAcademicAdmin);

// CLEAN COURSE ROUTES - USING CONTROLLER
router.post('/courses', protectSuperAdmin, upload.single('image'), createCourse);
router.get('/courses', protectSuperAdmin, getCourses);
router.get('/courses/:id', protectSuperAdmin, getCourse);
router.put('/courses/:id/contents', protectSuperAdmin, updateContents);

// Get academic admins for assign modal
router.get('/academic-admins-assign', protectSuperAdmin, getAcademicAdminsForAssign);

// Save course assignment to academic admins
router.post('/courses/assign', protectSuperAdmin, assignCourseToAdmins);
export default router;

// Get current assignments for a course (to pre-check checkboxes)
router.get('/courses/:courseId/assignments', protectSuperAdmin, getCourseAssignments);