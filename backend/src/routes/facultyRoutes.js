// backend/src/routes/facultyRoutes.js
import express from 'express';
import { 
  facultySignup, 
  facultyLogin, 
  getFacultyDashboard, 
  getFacultyProfile, 
  updateFacultyProfile, 
  getCourseDetails, 
  getUpcomingClasses,
  getUpcomingExams,
  getFacultyNotifications

} from '../controllers/facultyController.js';

import { uploadProfilePic } from '../controllers/facultyController.js'; // for photo
import { protectFaculty } from '../middleware/authMiddleware.js';
import { createCourseAssessment, getCourseAssessments } from '../controllers/assessmentController.js';

import { getFacultyCourses, createExam, getFacultyExams } from '../controllers/examController.js';

const router = express.Router();

// Public routes (no auth needed)
router.post('/signup', uploadProfilePic, facultySignup);
router.post('/login', facultyLogin);

// Protected routes (require valid faculty JWT)
router.get('/dashboard', protectFaculty, getFacultyDashboard);

// Upcoming classes for faculty home page
router.get('/upcoming-classes', protectFaculty, getUpcomingClasses);

// Course detail for faculty
router.get('/courses/:id', protectFaculty, getCourseDetails);

router.get('/profile', protectFaculty, getFacultyProfile);
router.patch('/profile', protectFaculty, uploadProfilePic, updateFacultyProfile);

// Create assessment – multer is now inside controller, so no separate upload middleware here
router.post('/courses/:courseId/assessments', protectFaculty, createCourseAssessment);

// Optional: Get all assessments for a course
router.get('/courses/:courseId/assessments', protectFaculty, getCourseAssessments);

router.get('/my-courses', protectFaculty, getFacultyCourses);
router.post('/exams', protectFaculty, createExam);
router.get('/exams', protectFaculty, getFacultyExams);
router.get('/upcoming-exams', protectFaculty, getUpcomingExams);

router.get('/notifications', protectFaculty, getFacultyNotifications);

export default router;