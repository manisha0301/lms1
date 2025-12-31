// src/routes/superAdminRoutes.js
import express from 'express';
import { academicAdminChangePassword, academicAdminLogin, getAcademicAdminProfile, updateAcademicAdminProfile} from '../controllers/academicAdminController.js';
import { protectAcademicAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', academicAdminLogin);
router.post('/change-password', protectAcademicAdmin, academicAdminChangePassword);
router.get('/profile', protectAcademicAdmin, getAcademicAdminProfile);
router.put('/profile', protectAcademicAdmin, updateAcademicAdminProfile);
export default router;