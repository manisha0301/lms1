// backend/src/controllers/assessmentController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';

import { addNotificationForFaculty } from '../models/notificationModel.js';

// Ensure folders exist
const questionUploadDir = path.join(process.cwd(), 'uploads/assessments/questions');
const submissionUploadDir = path.join(process.cwd(), 'uploads/assessments/submissions');

if (!fs.existsSync(questionUploadDir)) {
  fs.mkdirSync(questionUploadDir, { recursive: true });
  console.log('Created uploads/assessments/questions folder');
}
if (!fs.existsSync(submissionUploadDir)) {
  fs.mkdirSync(submissionUploadDir, { recursive: true });
  console.log('Created uploads/assessments/submissions folder');
}

// Multer for faculty question upload
const questionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, questionUploadDir);
  },
  filename: (req, file, cb) => {
    const courseId = req.params.courseId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const filename = `question-course${courseId}${ext}`;
    cb(null, filename);
  }
});

export const uploadQuestion = multer({
  storage: questionStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('assessmentPdf');

// Multer for student answer upload
const answerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionUploadDir);
  },
  filename: (req, file, cb) => {
    const assignmentId = req.params.assignmentId;
    const studentId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const filename = `answer-assignment${assignmentId}-student${studentId}${ext}`;
    cb(null, filename);
  }
});

export const uploadAnswer = multer({
  storage: answerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('assessmentPdf');

// Create assessment – uses uploadQuestion
export const createCourseAssessment = (req, res) => {
  uploadQuestion(req, res, async function (err) {
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
      console.log('Question file uploaded:', req.file ? req.file.filename : 'No file');
      console.log('Received body:', req.body);

      const { courseId } = req.params;
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized - no user ID' });
      }

      const facultyId = user.role === 'faculty' ? user.id : null;
      const weekId = req.body.weekId || null;

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
        pdfPath = `assessments/questions/${req.file.filename}`;
      }

      // Insert
      const { rows: [newAssessment] } = await pool.query(`
        INSERT INTO course_assessments (
          course_id, week_id,
          academic_admin_id, faculty_id,
          title, description, pdf_path,
          total_marks, due_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        courseId,
        weekId,
        academicAdminId,
        facultyId,
        title.trim(),
        description.trim() || null,
        pdfPath,
        marks,
        dueDate
      ]);

      // Notify the faculty who created it
      if (facultyId) {
        const { rows: [course] } = await pool.query(
          'SELECT name FROM courses WHERE id = $1',
          [courseId]
        );
        const courseName = course?.name || 'the course';

        const dueFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        const message = `You created a new assignment: "${title}" in ${courseName} (Due: ${dueFormatted})`;

        await addNotificationForFaculty(
          pool,
          message,
          'assignment',
          'medium',
          facultyId
        );
      }

      // Notify students in the same university/center about new assignment
      try {
        const { rows: courseAdmin } = await pool.query(`
          SELECT caa.academic_admin_id
          FROM course_academic_assignments caa
          WHERE caa.course_id = $1
          LIMIT 1
        `, [courseId]);

        if (courseAdmin.length === 0) return;

        const adminId = courseAdmin[0].academic_admin_id;

        const { rows: adminInfo } = await pool.query(`
          SELECT academic_name 
          FROM academic_admins 
          WHERE id = $1
        `, [adminId]);

        if (adminInfo.length === 0) return;

        const universityName = adminInfo[0].academic_name.trim();

        const { rows: students } = await pool.query(`
          SELECT id 
          FROM students 
          WHERE graduation_university ILIKE $1
        `, [`%${universityName}%`]);

        const studentIds = students.map(s => s.id);

        if (studentIds.length > 0) {
          const dueFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          const message = `New Assignment Posted: "${title}" (Due: ${dueFormatted})`;

          // Assuming notifyStudents is defined in notificationModel.js
          await notifyStudents(
            pool,
            message,
            'assignment',
            'medium',
            studentIds
          );
        }
      } catch (err) {
        console.error('Failed to notify students about new assignment:', err.message);
      }

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

// Get all assignments for a course (student view)
export const getCourseAssignmentsForStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const { rows } = await pool.query(`
      SELECT 
        a.id,
        a.title AS test_name,
        a.total_marks AS marks,
        TO_CHAR(a.due_date, 'YYYY-MM-DD') AS due_date,
        a.pdf_path AS question_pdf,
        s.answer_pdf_path AS answer_pdf
      FROM course_assessments a
      LEFT JOIN assignment_submissions s
        ON a.id = s.assignment_id AND s.student_id = $2
      WHERE a.course_id = $1
        AND a.pdf_path IS NOT NULL
      ORDER BY a.due_date ASC, a.created_at DESC
    `, [courseId, studentId]);

    res.json({
      success: true,
      assignments: rows
    });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ success: false, error: 'Failed to load assignments' });
  }
};

// Submit student's answer PDF – uses uploadAnswer
export const submitAssignmentAnswer = (req, res) => {
  uploadAnswer(req, res, async function (err) {
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
      console.log('Answer file uploaded:', req.file ? req.file.filename : 'No file');

      const { assignmentId } = req.params;
      const studentId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const answerPath = `assessments/submissions/${req.file.filename}`;

      await pool.query(`
        INSERT INTO assignment_submissions (assignment_id, student_id, answer_pdf_path)
        VALUES ($1, $2, $3)
        ON CONFLICT (assignment_id, student_id) 
        DO UPDATE SET 
          answer_pdf_path = EXCLUDED.answer_pdf_path,
          submitted_at = CURRENT_TIMESTAMP
      `, [assignmentId, studentId, answerPath]);

      res.json({ success: true, message: 'Answer submitted successfully' });
    } catch (error) {
      console.error('Submit answer error:', error.stack);
      res.status(500).json({ success: false, error: 'Server error during submission: ' + (error.message || 'Unknown error') });
    }
  });
};