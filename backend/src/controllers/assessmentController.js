// backend/src/controllers/assessmentController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';

import { addNotificationForFaculty, addNotificationForStudents } from '../models/notificationModel.js';

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
    const filename = `question-course${courseId}-${timestamp}${ext}`;
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
    const filename = `answer-assignment${assignmentId}-student${studentId}-${timestamp}${ext}`;
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

      if (!title || !totalMarks || !dueDate) {
        return res.status(400).json({
          success: false,
          error: 'Title, total marks, and due date are required'
        });
      }

      const marks = parseInt(totalMarks, 10);
      if (isNaN(marks) || marks <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Total marks must be a positive integer'
        });
      }

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

      let pdfPath = null;
      if (req.file) {
        pdfPath = `assessments/questions/${req.file.filename}`;
      }

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

      // Faculty self notification 
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

      // Notify all students belonging to the same university/center
      
      try {

        // Find all academic admins this course is assigned to
        const { rows: courseAdmins } = await pool.query(`
          SELECT academic_admin_id
          FROM course_academic_assignments
          WHERE course_id = $1
        `, [courseId]);

        if (courseAdmins.length === 0) {
          console.log(`No academic admin assignment found for course ${courseId} → skipping student notifications`);
        } else {
          const adminIds = courseAdmins.map(row => row.academic_admin_id);

          // Get all students whose graduation_university matches any of these centers
          const { rows: students } = await pool.query(`
            SELECT id
            FROM students
            WHERE graduation_university IS NOT NULL
              AND LOWER(graduation_university) IN (
                SELECT LOWER(academic_name)
                FROM academic_admins
                WHERE id = ANY($1)
              )
          `, [adminIds]);

          if (students.length > 0) {
            const studentIds = students.map(s => s.id);

            const dueFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            const message = `New Assignment: "${title}" (Due: ${dueFormatted})`;

            // Send bulk notification to all relevant students
            await addNotificationForStudents(
              pool,
              message,
              'assignment',
              'medium',           
              studentIds
            );

            console.log(`Sent new assignment notification to ${studentIds.length} students`);
          } else {
            console.log(`No matching students found for this center → no notifications sent`);
          }
        }
      } catch (notifyError) {
        console.error('Failed to send student notifications (non-blocking):', notifyError.message);
        
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

// Faculty fetches submissions for one assignment
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const facultyId = req.user.id;

    //Only faculty who teaches the course can see submissions
    const { rows: permCheck } = await pool.query(`
      SELECT ca.course_id 
      FROM course_assessments ca 
      JOIN courses c ON ca.course_id = c.id
      WHERE ca.id = $1 AND $2 = ANY(c.teachers)
    `, [assignmentId, facultyId]);

    if (permCheck.length === 0) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const { rows: submissions } = await pool.query(`
      SELECT 
        s.id,
        st.student_id AS student_code,
        CONCAT(st.first_name, ' ', st.last_name) AS student_name,
        s.answer_pdf_path,
        s.submitted_at,
        s.marks,
        s.remarks,
        s.graded_at
      FROM assignment_submissions s
      JOIN students st ON s.student_id = st.id
      WHERE s.assignment_id = $1
      ORDER BY s.submitted_at DESC NULLS LAST
    `, [assignmentId]);

    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Get submissions error:', error.stack);
    res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
  }
};

// Faculty updates marks & remarks
export const updateSubmissionEvaluation = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, remarks } = req.body;
    const facultyId = req.user.id;

    const { rows: permCheck } = await pool.query(`
      SELECT ca.course_id 
      FROM assignment_submissions s
      JOIN course_assessments ca ON s.assignment_id = ca.id
      JOIN courses c ON ca.course_id = c.id
      WHERE s.id = $1 AND $2 = ANY(c.teachers)
    `, [submissionId, facultyId]);

    if (permCheck.length === 0) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await pool.query(`
      UPDATE assignment_submissions
      SET 
        marks = $1,
        remarks = $2,
        graded_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [
      marks !== undefined ? marks : null,
      remarks !== undefined ? remarks : null,
      submissionId
    ]);

    res.json({ success: true, message: 'Evaluation updated' });
  } catch (error) {
    console.error('Update evaluation error:', error.stack);
    res.status(500).json({ success: false, error: 'Failed to update evaluation' });
  }
};


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
        s.answer_pdf_path AS answer_pdf,
        s.marks AS marks_obtained,
        s.remarks AS remarks
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
    console.error('Get student assignments error:', error.stack);
    res.status(500).json({ success: false, error: 'Failed to load assignments' });
  }
};