// backend/src/routes/studentRoutes.js
import express from 'express';
import { studentSignup, studentLogin, getStudentCourses } from '../controllers/studentController.js';  // ← ADD getStudentCourses
import { protectStudent } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Student Signup
router.post('/signup', studentSignup);

// Student Login
router.post('/login', studentLogin);

// Get courses for logged-in student (protected)
router.get('/courses', protectStudent, getStudentCourses);

export default router;