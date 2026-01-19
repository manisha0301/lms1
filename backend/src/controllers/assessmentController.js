// backend/src/controllers/assessmentController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';

// Ensure folder exists
const assessmentUploadDir = path.join(process.cwd(), 'uploads/assessments');
if (!fs.existsSync(assessmentUploadDir)) {
  fs.mkdirSync(assessmentUploadDir, { recursive: true });
  console.log('Created uploads/assessments folder');
}

// Multer config – field name MUST be 'assessmentPdf'
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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('assessmentPdf'); // ← exact field name from frontend

// Create assessment – multer runs first
// Create assessment – multer runs first
export const createCourseAssessment = (req, res) => {
  upload(req, res, async function (err) {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 10MB)' : err.message
      });
    } else if (err) {
      console.error('Upload error:', err.stack);
      return res.status(500).json({ success: false, error: 'File upload failed: ' + err.message });
    }

    try {
      console.log('File uploaded:', req.file ? req.file.filename : 'No file');
      console.log('Received body:', req.body); // Debug what frontend sent

      const { courseId } = req.params;
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized - no user ID' });
      }

      const facultyId = user.role === 'faculty' ? user.id : null;

      // Fetch faculty's academic_admin_id (safe)
      let academicAdminId = null;
      if (facultyId) {
        const { rows: facultyRows } = await pool.query(
          'SELECT academic_admin_id FROM faculty WHERE id = $1',
          [facultyId]
        );
        if (facultyRows.length > 0 && facultyRows[0].academic_admin_id) {
          academicAdminId = facultyRows[0].academic_admin_id;
        }
      }

      const {
        title,
        description = '',
        totalMarks,
        dueDate
      } = req.body;

      // Required fields
      if (!title || !totalMarks || !dueDate) {
        return res.status(400).json({
          success: false,
          error: 'Title, total marks, and due date are required'
        });
      }

      // Parse & validate marks
      const marks = parseInt(totalMarks, 10);
      if (isNaN(marks) || marks <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Total marks must be a positive integer'
        });
      }

      // Authorization: Check if faculty teaches the course
      const { rows: authCheck } = await pool.query(`
        SELECT teachers FROM courses WHERE id = $1
      `, [courseId]);

      if (authCheck.length === 0) {
        return res.status(404).json({ success: false, error: 'Course not found' });
      }

      const teachers = authCheck[0].teachers || [];
      const isTeacher = teachers.includes(facultyId);

      if (!isTeacher && facultyId) {
        return res.status(403).json({ success: false, error: 'You are not assigned to teach this course' });
      }

      // PDF path
      let pdfPath = null;
      if (req.file) {
        pdfPath = `assessments/${req.file.filename}`;
      }

      // Insert (week_id = null since you don't want week selection)
      const { rows: [newAssessment] } = await pool.query(`
        INSERT INTO course_assessments (
          course_id, week_id,
          academic_admin_id, faculty_id,
          title, description, pdf_path,
          total_marks, due_date
        ) VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        courseId,
        academicAdminId,
        facultyId,
        title.trim(),
        description.trim() || null,
        pdfPath,
        marks,
        dueDate
      ]);

      res.status(201).json({
        success: true,
        message: 'Assessment created successfully',
        assessment: newAssessment
      });
    } catch (error) {
      console.error('Create assessment FULL ERROR:', error.stack);
      res.status(500).json({
        success: false,
        error: 'Server error during creation: ' + (error.message || 'Unknown error')
      });
    }
  });
};

// Your getCourseAssessments function (unchanged)
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
        a.total_marks, a.due_date,
        w.title AS week_title, w."order" AS week_order
      FROM course_assessments a
      JOIN courses c ON a.course_id = c.id
      LEFT JOIN course_weeks w ON a.week_id = w.id
      WHERE a.course_id = $1 ${condition}
      ORDER BY w."order" NULLS LAST, a.created_at DESC
    `, params);

    res.json({ success: true, assessments: rows });
  } catch (err) {
    console.error('Get assessments error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch assessments' });
  }
};