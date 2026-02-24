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

import { uploadProfilePic } from '../controllers/facultyController.js';
import { protectFaculty, protectStudent } from '../middleware/authMiddleware.js';
import { 
  createCourseAssessment, 
  getCourseAssessments,
  getAssignmentSubmissions,
  updateSubmissionEvaluation,
  uploadAnswer,           // ← Import the multer middleware
  submitAssignmentAnswer  // ← Import the handler
} from '../controllers/assessmentController.js';

import { getFacultyCourses, createExam, getFacultyExams } from '../controllers/examController.js';

import {
  uploadChapterVideo,
  getChapterVideo,
  deleteChapterVideo,
} from '../controllers/videoController.js';

import { uploadVideo } from '../middleware/videoUpload.js';

import { sendEmailOTP, verifyEmailOTP } from '../controllers/verificationController.js';

import { sendOTP, verifyOTP, resendOTP } from '../controllers/otpController.js';

const router = express.Router();

// Public routes (signup and login)
router.post('/signup', uploadProfilePic, facultySignup);
router.post('/login', facultyLogin);

// Protected faculty routes
router.get('/dashboard', protectFaculty, getFacultyDashboard);
router.get('/upcoming-classes', protectFaculty, getUpcomingClasses);
router.get('/courses/:id', protectFaculty, getCourseDetails);
router.get('/profile', protectFaculty, getFacultyProfile);
router.patch('/profile', protectFaculty, uploadProfilePic, updateFacultyProfile);

// Assignment routes - Faculty creates and views assessments
router.post('/courses/:courseId/assessments', protectFaculty, createCourseAssessment);
router.get('/courses/:courseId/assessments', protectFaculty, getCourseAssessments);

// Faculty views student submissions for a specific assignment
router.get('/assignments/:assignmentId/submissions', protectFaculty, getAssignmentSubmissions);

// Faculty updates marks and remarks for a submission
router.patch('/submissions/:submissionId', protectFaculty, updateSubmissionEvaluation);

router.post(
  '/assignments/:assignmentId/submit',
  protectStudent,                // ← Change to protectStudent later
  uploadAnswer,                  // ← multer middleware (called correctly)
  submitAssignmentAnswer         // ← handler
);

// Exam routes
router.get('/my-courses', protectFaculty, getFacultyCourses);
router.post('/exams', protectFaculty, createExam);
router.get('/exams', protectFaculty, getFacultyExams);
router.get('/upcoming-exams', protectFaculty, getUpcomingExams);

// Notifications
router.get('/notifications', protectFaculty, getFacultyNotifications);

// Video upload routes
router.post('/upload-video', protectFaculty, uploadVideo, uploadChapterVideo);
router.get('/chapter-video/:chapterId', protectFaculty, getChapterVideo);
router.delete('/chapter-video/:chapterId', protectFaculty, deleteChapterVideo);

// OTP verification routes
router.post('/verify-email/send-otp', sendEmailOTP);
router.post('/verify-email/verify-otp', verifyEmailOTP);
router.post('/verify-phone/send-otp', sendOTP);
router.post('/verify-phone/verify-otp', verifyOTP);
router.post('/verify-phone/resend-otp', resendOTP);

export default router;