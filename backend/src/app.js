// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';                    
import { fileURLToPath } from 'url';       

import pool from './config/db.js';

// Start the cron job
import './utils/reminderCron.js';

import { createDefaultSuperAdmin, createSuperAdminTable } from './models/superAdminModel.js';
import { 
  createCourseAcademicRelationTable, 
  createCoursesTable,
  createAcademicCourseSchedulesTable,
  createCourseWeeksTable,
  createCourseModulesTables,
  assessmentsTableSetup,
  assignmentSubmissionsTableSetup
} from './models/courseModel.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import { createAcademicAdminsTable, createAcademicAdminDetailsTable } from './models/academicAdminModel.js';
import adminRoutes from './routes/adminRoutes.js';
import { createFacultyTable } from './models/facultyModel.js';
import facultyRoutes from './routes/facultyRoutes.js';
import { createNotificationsTable } from './models/notificationModel.js';
// NEW: Student imports
import studentRoutes from './routes/studentRoutes.js';
import { createStudentsTable } from './models/studentModel.js';
import { createExamsTables } from './models/examModel.js'; // NEW: Import createExamsTables

// NEW: Video model setup
import { setupVideoTables } from './models/videoModel.js';

import { createEmailVerificationsTable } from './models/verificationModel.js';

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);         

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow anything on localhost / 127.0.0.1 / your LAN IP
    if (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('http://172.30.3.') ||           // ← your current subnet
      origin.startsWith('http://192.168.') ||             // common home/office subnets
      origin.startsWith('http://10.')                     // another common private range
    ) {
      return callback(null, true);
    }

    // You can later tighten this list for production
    const allowed = [
      'http://localhost:5173',
      'http://superadmin.localhost:5173',
      'http://admin.localhost:5173',
      'http://faculty.localhost:5173',
      'http://academic.localhost:5173',
      'http://student.localhost:5173',
    ];

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// SERVE UPLOADED IMAGES & VIDEOS
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
    await createExamsTables(); // NEW: Initialize exam tables
    await assignmentSubmissionsTableSetup();

    // NEW: Initialize video table
    await setupVideoTables();

    await createEmailVerificationsTable();

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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth/superadmin', superAdminRoutes);
app.use('/api/auth/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);
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
app.listen(PORT, "0.0.0.0", () => {
  console.log('\nKRISTELLAR LMS BACKEND STARTED');
  console.log(`Server running on http://localhost:${PORT}`);
});