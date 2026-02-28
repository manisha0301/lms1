// backend/src/routes/studentRoutes.js
import express from 'express';
import { studentSignup, studentLogin, getStudentCourses, getStudentProfile, updateStudentProfile, getStudentUpcomingClasses, getStudentNotifications, getStudentAssignmentProgress,  changeStudentPassword, deleteStudentAccount, submitCourseRating, getMyCourseRating } from '../controllers/studentController.js';  
import { getCourse } from '../controllers/courseController.js';
import { protectStudent } from '../middleware/authMiddleware.js'; 
import { getCourseExamLink, submitExamAnswer, getStudentExamResults } from '../controllers/examController.js';
import { getCourseAssignmentsForStudent, submitAssignmentAnswer } from '../controllers/assessmentController.js';
import { getChapterVideoForStudent } from '../controllers/videoController.js';
import { sendEmailOTP, verifyEmailOTP } from '../controllers/verificationController.js';
// import { getLandingPageData } from '../controllers/landingController.js';

// ADD THIS IMPORT FOR PHONE OTP
import { sendOTP, verifyOTP, resendOTP } from '../controllers/otpController.js';

const router = express.Router();

// Student Signup
router.post('/signup', studentSignup);

// Student Login
router.post('/login', studentLogin);

// Get courses for logged-in student (protected)
router.get('/courses', protectStudent, getStudentCourses);

// Course details for students
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

// NEW: Student uploads exam answer PDF
router.post('/upload-exam', protectStudent, submitExamAnswer);

// Get exam results for a specific course
router.get('/courses/:courseId/exam-results', protectStudent, getStudentExamResults);

router.get('/chapter-video/:chapterId', protectStudent, getChapterVideoForStudent);

// Email OTP routes
router.post('/verify-email/send-otp', sendEmailOTP);
router.post('/verify-email/verify-otp', verifyEmailOTP);

// NEW: Phone OTP routes for student
router.post('/verify-phone/send-otp', sendOTP);
router.post('/verify-phone/verify-otp', verifyOTP);
router.post('/verify-phone/resend-otp', resendOTP);

router.get('/assignment-progress', protectStudent, getStudentAssignmentProgress);

// router.get("/courses", getAllCoursesForStudents);

// Change student password
router.put('/change-password', protectStudent, changeStudentPassword);

// Delete student account
router.delete('/account', protectStudent, deleteStudentAccount);

// Submit rating for a course (protected - only logged-in student)
router.post('/courses/:courseId/rate', protectStudent, submitCourseRating);

router.get('/courses/:courseId/my-rating', protectStudent, getMyCourseRating);

export default router;