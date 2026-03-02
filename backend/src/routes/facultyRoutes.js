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
  getFacultyNotifications,
  changeFacultyPassword,
  deleteFacultyAccount,
  checkFacultyEmailAvailability
} from '../controllers/facultyController.js';

import { uploadProfilePic } from '../controllers/facultyController.js';
import { protectFaculty, protectStudent } from '../middleware/authMiddleware.js';
import { 
  createCourseAssessment, 
  getCourseAssessments,
  getAssignmentSubmissions,
  updateSubmissionEvaluation,
  uploadAnswer,
  submitAssignmentAnswer
} from '../controllers/assessmentController.js';

import { getFacultyCourses, createExam, getFacultyExams,getExamSubmissions, updateExamSubmissionEvaluation } from '../controllers/examController.js';

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

// FIXED: Add profile routes
router.get('/profile', protectFaculty, getFacultyProfile);
router.put('/profile', protectFaculty, updateFacultyProfile);  // ← Added for edit

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
  protectStudent,
  uploadAnswer,
  submitAssignmentAnswer
);

// Exam routes
router.get('/my-courses', protectFaculty, getFacultyCourses);
router.post('/exams', protectFaculty, createExam);
router.get('/exams', protectFaculty, getFacultyExams);
router.get('/upcoming-exams', protectFaculty, getUpcomingExams);

// Get submissions for a specific exam (to show students in dropdown + table)
router.get('/exams/:examId/submissions', protectFaculty, getExamSubmissions);

// Update marks & remarks for an exam submission
router.patch('/exams/submissions/:submissionId', protectFaculty, updateExamSubmissionEvaluation);

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

// Change faculty password
router.put('/change-password', protectFaculty, changeFacultyPassword);

// Delete faculty account
router.delete('/account', protectFaculty, deleteFacultyAccount);

// New route to check email availability
router.post('/check-email', checkFacultyEmailAvailability);

export default router;