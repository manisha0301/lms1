// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import pool from './config/db.js';
import { createSuperAdminTable } from './models/superAdminModel.js';

import superAdminRoutes from './routes/superAdminRoutes.js';

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

// Initialize DB tables
const initDatabase = async () => {
  try {
    await createSuperAdminTable(pool);
    console.log('All database tables initialized');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
};

initDatabase();

// Routes
app.use('/api/auth/superadmin', superAdminRoutes);

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
