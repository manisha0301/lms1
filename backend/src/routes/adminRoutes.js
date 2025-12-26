// src/routes/superAdminRoutes.js
import express from 'express';
import { academicAdminChangePassword, academicAdminLogin} from '../controllers/academicAdminController.js';
import { protectAcademicAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', academicAdminLogin);
router.post('/change-password', protectAcademicAdmin, academicAdminChangePassword);

export default router;