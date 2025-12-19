// src/routes/superAdminRoutes.js
import express from 'express';
import { superAdminLogin } from '../controllers/superAdminController.js';

const router = express.Router();

router.post('/login', superAdminLogin);

export default router;