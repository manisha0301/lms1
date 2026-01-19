// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';                    
import { fileURLToPath } from 'url';       

import pool from './config/db.js';
import { createDefaultSuperAdmin, createSuperAdminTable } from './models/superAdminModel.js';
import { 
  createCourseAcademicRelationTable, 
  createCoursesTable,
  createAcademicCourseSchedulesTable,  // ← ADDED THIS IMPORT
  createCourseWeeksTable,
  createCourseModulesTables,
  assessmentsTableSetup
} from './models/courseModel.js';
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
    await createAcademicAdminDetailsTable(pool);
    await createCoursesTable(pool);
    await createCourseAcademicRelationTable(pool);
    await createCourseWeeksTable(pool);
    await createCourseModulesTables(pool);
    await createNotificationsTable(pool);
    await createFacultyTable();
    await createStudentsTable();
    await createAcademicCourseSchedulesTable();
    await assessmentsTableSetup(pool);

    console.log('All database tables initialized');

    // NEW: One-time migration - Add academic_admin_id column to faculty if it doesn't exist
    await pool.query(`
      ALTER TABLE faculty 
      ADD COLUMN IF NOT EXISTS academic_admin_id INTEGER REFERENCES academic_admins(id) ON DELETE SET NULL;
    `);
    console.log('Added academic_admin_id column to faculty if missing');

    // Migration for super_admins table: add full_name and phone columns
    await pool.query(`
      ALTER TABLE super_admins
      ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `);
    console.log('Added full_name and phone columns to super_admins if missing');

    // Optional: Set default full_name for existing super admin if missing
    await pool.query(`
      UPDATE super_admins
      SET full_name = 'Super Admin'
      WHERE full_name IS NULL OR full_name = '';
    `);
    console.log('Set default full_name for super admins where missing');

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