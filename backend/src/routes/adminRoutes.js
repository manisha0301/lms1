// src/routes/superAdminRoutes.js
import express from 'express';
import { academicAdminChangePassword, academicAdminLogin, getAcademicAdminProfile, getAssignedCourses, getCourseDetails, updateAcademicAdminProfile} from '../controllers/academicAdminController.js';
import { protectAcademicAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', academicAdminLogin);
router.post('/change-password', protectAcademicAdmin, academicAdminChangePassword);
router.get('/profile', protectAcademicAdmin, getAcademicAdminProfile);
router.put('/profile', protectAcademicAdmin, updateAcademicAdminProfile);
router.get('/courses', protectAcademicAdmin, getAssignedCourses);
router.get('/courses/:id', protectAcademicAdmin, getCourseDetails);

export default router;