// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';                    
import { fileURLToPath } from 'url';       

import pool from './config/db.js';
import { createDefaultSuperAdmin, createSuperAdminTable } from './models/superAdminModel.js';
import { createCourseAcademicRelationTable, createCoursesTable } from './models/courseModel.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import { createAcademicAdminsTable , createAcademicAdminDetailsTable} from './models/academicAdminModel.js';
import adminRoutes from './routes/adminRoutes.js';
import { createFacultyTable } from './models/facultyModel.js';
import facultyRoutes from './routes/facultyRoutes.js';
import { createNotificationsTable } from './models/notificationModel.js';
// NEW: Student imports
import studentRoutes from './routes/studentRoutes.js';
import { createStudentsTable } from './models/studentModel.js';

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);         

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://superadmin.localhost:5173",
    "http://admin.localhost:5173",
    "http://faculty.localhost:5173",
    "http://academic.localhost:5173",
    "http://student.localhost:5173"
  ],
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));

// SERVE UPLOADED IMAGES
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize DB tables
const initDatabase = async () => {
  try {
    await createSuperAdminTable(pool);
    await createDefaultSuperAdmin(pool);
    await createAcademicAdminsTable(pool);
    await createCoursesTable(pool);
    await createCourseAcademicRelationTable(pool);
    await createAcademicAdminDetailsTable(pool);
    await createFacultyTable();
    await createNotificationsTable(pool);

    // NEW: Create students table
    await createStudentsTable();

    console.log('All database tables initialized');
    
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
};

initDatabase();

// Routes
app.use('/api/auth/superadmin', superAdminRoutes);
app.use('/api/auth/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

// NEW: Student routes
app.use('/api/auth/student', studentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\nKRISTELLAR LMS BACKEND STARTED');
  console.log(`Server running on http://localhost:${PORT}`);
});