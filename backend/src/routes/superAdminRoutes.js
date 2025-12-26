// src/routes/superAdminRoutes.js
import express from 'express';
import { superAdminChangePassword, superAdminLogin } from '../controllers/superAdminController.js';
import {protectSuperAdmin} from '../middleware/authMiddleware.js';
import { createNewAcademicAdmin, getAllAcademicAdmins } from '../controllers/academicAdminController.js';

const router = express.Router();

router.post('/login', superAdminLogin);
router.post('/change-password', protectSuperAdmin, superAdminChangePassword); // New protected route
router.get('/academic-admins', getAllAcademicAdmins);
router.post('/academic-admins', createNewAcademicAdmin);

export default router;