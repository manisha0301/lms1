// backend/src/routes/studentRoutes.js
import express from 'express';
import { studentSignup, studentLogin, getStudentCourses, getStudentProfile, updateStudentProfile, getStudentUpcomingClasses, getStudentNotifications } from '../controllers/studentController.js';  
import { getCourse } from '../controllers/courseController.js';
import { protectStudent } from '../middleware/authMiddleware.js'; 
import { getCourseExamLink } from '../controllers/examController.js';
import { getCourseAssignmentsForStudent, submitAssignmentAnswer } from '../controllers/assessmentController.js';

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

// Get exam link for a specific course
router.get('/courses/:courseId/exam-link', protectStudent, getCourseExamLink);

router.get('/notifications', protectStudent, getStudentNotifications);

// List assignments for the course
router.get('/courses/:courseId/assignments', protectStudent, getCourseAssignmentsForStudent);

// Submit answer PDF
router.post('/assignments/:assignmentId/submit', protectStudent, submitAssignmentAnswer);

export default router;