// backend/src/routes/facultyRoutes.js
import express from 'express';
import { facultySignup, facultyLogin } from '../controllers/facultyController.js';
import { uploadProfilePic } from '../controllers/facultyController.js'; // for photo

const router = express.Router();

// Public routes (no auth needed)
router.post('/signup', uploadProfilePic, facultySignup);
router.post('/login', facultyLogin);

export default router;