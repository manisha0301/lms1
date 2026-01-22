// backend/src/routes/studentRoutes.js
import express from 'express';
import { studentSignup, studentLogin, getStudentCourses, getStudentProfile, updateStudentProfile, getStudentUpcomingClasses } from '../controllers/studentController.js';  
import { getCourse } from '../controllers/courseController.js';
import { protectStudent } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Student Signup
router.post('/signup', studentSignup);

// Student Login
router.post('/login', studentLogin);

// Get courses for logged-in student (protected)
router.get('/courses', protectStudent, getStudentCourses);

// Get course details for students
router.get('/courses/:id', protectStudent, getCourse);

router.get('/profile', protectStudent, getStudentProfile);

router.put('/profile', protectStudent, updateStudentProfile);

router.get('/upcoming-classes', protectStudent, getStudentUpcomingClasses);

export default router;