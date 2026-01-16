// backend/src/controllers/assessmentController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ensure uploads/assessments folder exists
const assessmentUploadDir = path.join(process.cwd(), 'uploads/assessments');
if (!fs.existsSync(assessmentUploadDir)) {
  fs.mkdirSync(assessmentUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assessmentUploadDir);
  },
  filename: (req, file, cb) => {
    const courseId = req.params.courseId;
    const weekId = req.body.weekId || 'general';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    
    const filename = `assessment-course${courseId}-week${weekId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

export const uploadAssessmentPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
}).single('assessmentPdf');


// backend/src/controllers/assessmentController.js

export const createCourseAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    let creatorId = user.id;
    let creatorType = user.role; // 'faculty' or 'academicadmin'

    const {
      weekId,           // optional
      title,
      description,
      totalMarks,
      dueDate
    } = req.body;

    if (!title || !totalMarks || !dueDate) {
      return res.status(400).json({
        success: false,
        error: 'Title, total marks, and due date are required'
      });
    }

    // ── Authorization check ───────────────────────────────────────
    let isAuthorized = false;

    if (creatorType === 'academicadmin') {
      const { rows } = await pool.query(`
        SELECT 1 FROM course_academic_assignments 
        WHERE course_id = $1 AND academic_admin_id = $2
      `, [courseId, creatorId]);
      isAuthorized = rows.length > 0;
    } 
    else if (creatorType === 'faculty') {
      const { rows } = await pool.query(`
        SELECT 1 FROM courses 
        WHERE id = $1 AND $2 = ANY(teachers)
      `, [courseId, creatorId]);
      isAuthorized = rows.length > 0;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to create assessments for this course'
      });
    }

    // ── Upload handling ───────────────────────────────────────────
    let pdfPath = null;
    if (req.file) {
      pdfPath = `assessments/${req.file.filename}`;
    }

    // ── Insert assessment ─────────────────────────────────────────
    const { rows: [newAssessment] } = await pool.query(`
      INSERT INTO course_assessments (
        course_id, week_id,
        academic_admin_id,           -- can be NULL if created by faculty
        title, description, pdf_path,
        total_marks, due_date,
        created_by_type, created_by_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      courseId,
      weekId || null,
      creatorType === 'academicadmin' ? creatorId : null,
      title,
      description || null,
      pdfPath,
      parseInt(totalMarks),
      dueDate,
      creatorType,
      creatorId
    ]);

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      assessment: newAssessment
    });

  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create assessment: ' + (error.message || 'Internal error')
    });
  }
};

export const getCourseAssessments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;

    let condition = '';
    let params = [courseId];

    if (user.role === 'academicadmin') {
      condition = 'AND a.academic_admin_id = $2';
      params.push(user.id);
    } else if (user.role === 'faculty') {
      condition = 'AND $2 = ANY(c.teachers)';
      params.push(user.id);
    }

    const { rows } = await pool.query(`
      SELECT 
        a.id, a.title, a.description, a.pdf_path,
        a.total_marks, a.due_date, a.created_by_type,
        w.title AS week_title, w."order" AS week_order
      FROM course_assessments a
      JOIN courses c ON a.course_id = c.id
      LEFT JOIN course_weeks w ON a.week_id = w.id
      WHERE a.course_id = $1 ${condition}
      ORDER BY w."order" NULLS LAST, a.created_at DESC
    `, params);

    res.json({ success: true, assessments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch assessments' });
  }
};