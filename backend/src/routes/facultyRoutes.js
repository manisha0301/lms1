// backend/src/routes/facultyRoutes.js
import express from 'express';
import { facultySignup, facultyLogin, getFacultyDashboard, getFacultyProfile, updateFacultyProfile, getCourseDetails } from '../controllers/facultyController.js';
import { uploadProfilePic } from '../controllers/facultyController.js'; // for photo
import { protectFaculty } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no auth needed)
router.post('/signup', uploadProfilePic, facultySignup);
router.post('/login', facultyLogin);

// Protected routes (require valid faculty JWT)
router.get('/dashboard', protectFaculty, getFacultyDashboard);

// Course detail for faculty
router.get('/courses/:id', protectFaculty, getCourseDetails);

router.get('/profile', protectFaculty, getFacultyProfile);
router.patch('/profile', protectFaculty, uploadProfilePic, updateFacultyProfile);

export default router;