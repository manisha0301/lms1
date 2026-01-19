// src/routes/adminRoutes.js
import express from 'express';
import { 
  academicAdminChangePassword, 
  academicAdminLogin, 
  getAcademicAdminProfile, 
  getAssignedCourses, 
  getCourseDetails, 
  updateAcademicAdminProfile,
  getUniversityStudents,
  getStudentByIdForAdmin
} from '../controllers/academicAdminController.js';

import { protectAcademicAdmin } from '../middleware/authMiddleware.js';

// Faculty Management
import { createFaculty, 
        getFacultyList, 
        uploadProfilePic , 
        approvePendingFaculty,
        rejectPendingFaculty
 } from '../controllers/facultyController.js';

import { 
  updateCourseTeachers,
  getAcademicCourseScheduleCtrl,
  saveAcademicCourseScheduleCtrl
} from '../controllers/courseController.js';

const router = express.Router();

router.post('/login', academicAdminLogin);
router.post('/change-password', protectAcademicAdmin, academicAdminChangePassword);
router.get('/profile', protectAcademicAdmin, getAcademicAdminProfile);
router.put('/profile', protectAcademicAdmin, updateAcademicAdminProfile);
router.get('/courses', protectAcademicAdmin, getAssignedCourses);
router.get('/courses/:id', protectAcademicAdmin, getCourseDetails);

// Faculty Routes
router.post('/faculty', protectAcademicAdmin, uploadProfilePic, createFaculty);
router.get('/faculty', protectAcademicAdmin, getFacultyList);

router.patch('/faculty/:facultyId/approve', protectAcademicAdmin, approvePendingFaculty);
router.patch('/faculty/:facultyId/reject', protectAcademicAdmin, rejectPendingFaculty);

router.patch('/courses/:courseId/teachers', protectAcademicAdmin, updateCourseTeachers);

// NEW: Academic admin specific course schedule (batch timings + meeting link)
router.get('/courses/:id/schedule', protectAcademicAdmin, getAcademicCourseScheduleCtrl);
router.post('/courses/:id/schedule', protectAcademicAdmin, saveAcademicCourseScheduleCtrl);


// NEW: Get a single student by ID (for admin view)
router.get('/students/:id', protectAcademicAdmin, getStudentByIdForAdmin);
router.get('/university-students', protectAcademicAdmin, getUniversityStudents);

export default router;