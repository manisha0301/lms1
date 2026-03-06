// src/controllers/examController.js
import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { addNotificationForFaculty, addNotificationForStudents } from '../models/notificationModel.js';

// ────────────────────────────────────────────────
// ENSURE FOLDERS EXIST (same as assessments)
// ────────────────────────────────────────────────
const examSubmissionUploadDir = path.join(process.cwd(), 'uploads/exams/submissions');

if (!fs.existsSync(examSubmissionUploadDir)) {
  fs.mkdirSync(examSubmissionUploadDir, { recursive: true });
  console.log('Created uploads/exams/submissions folder');
}

// ────────────────────────────────────────────────
// MULTER FOR STUDENT EXAM ANSWER UPLOAD (same style as uploadAnswer)
// ────────────────────────────────────────────────
const examAnswerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, examSubmissionUploadDir);
  },
  filename: (req, file, cb) => {
    const examId = req.body.examId || 'unknown';
    const studentId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const filename = `answer-exam${examId}-student${studentId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

export const uploadExamAnswer = multer({
  storage: examAnswerStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB (you can match assignments' 10MB if you want)
}).single('file');  // ← field name must match frontend FormData key: 'file'

// ────────────────────────────────────────────────
// CONTROLLER FUNCTIONS
// ────────────────────────────────────────────────

// Get all courses assigned to this faculty (for dropdown)
export const getFacultyCourses = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const { rows } = await pool.query(`
      SELECT 
        id, 
        name, 
        type,
        price,
        description
      FROM courses 
      WHERE $1 = ANY(teachers)
      ORDER BY name ASC
    `, [facultyId]);

    res.json({
      success: true,
      courses: rows
    });
  } catch (error) {
    console.error('Get faculty courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

// Create new exam + multiple slots
// Create new exam + multiple slots
export const createExam = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { topic, courseId, examLink, totalMarks, slots } = req.body;

    if (!topic || !courseId || !totalMarks || !slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields or slots' });
    }

    // Verify faculty teaches this course
    const { rows: courseCheck } = await pool.query(
      'SELECT id FROM courses WHERE id = $1 AND $2 = ANY(teachers)',
      [courseId, facultyId]
    );

    if (courseCheck.length === 0) {
      return res.status(403).json({ success: false, error: 'You are not assigned to this course' });
    }

    // Insert main exam
    const { rows: exam } = await pool.query(
      `INSERT INTO exams (faculty_id, course_id, topic, exam_link, total_marks)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [facultyId, courseId, topic, examLink || null, totalMarks]
    );

    const examId = exam[0].id;

    // Insert all slots
    for (const slot of slots) {
      await pool.query(
        `INSERT INTO exam_slots (exam_id, date, start_time, end_time)
         VALUES ($1, $2, $3, $4)`,
        [examId, slot.date, slot.startTime, slot.endTime]
      );
    }

    // ────────────────────────────────────────────────────────────────
    // Get course name (for better notification messages)
    // ────────────────────────────────────────────────────────────────
    const { rows: [course] } = await pool.query(
      'SELECT name FROM courses WHERE id = $1',
      [courseId]
    );
    const courseName = course?.name || 'the course';

    // ────────────────────────────────────────────────────────────────
    // Notify the faculty who created it (your existing code)
    // ────────────────────────────────────────────────────────────────
    const messageFaculty = `You created a new exam: "${topic}" in ${courseName} (${slots.length} slots)`;
    await addNotificationForFaculty(
      pool,
      messageFaculty,
      'exam',
      'medium',
      facultyId
    );

    // ────────────────────────────────────────────────────────────────
    // NEW: Notify students of the same university/center
    // ────────────────────────────────────────────────────────────────
    try {
      // Find academic admin(s) this course belongs to
      const { rows: caaRows } = await pool.query(`
        SELECT academic_admin_id
        FROM course_academic_assignments
        WHERE course_id = $1
      `, [courseId]);

      if (caaRows.length === 0) {
        console.log(`No academic admin found for course ${courseId} → skipping student exam notification`);
      } else {
        const adminIds = caaRows.map(r => r.academic_admin_id);

        // Find students in these centers/universities
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

          // Optional: format first slot or date range for message
          const firstSlot = slots[0] || {};
          const dateStr = firstSlot.date 
            ? new Date(firstSlot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'scheduled';

          const messageStudent = `New Exam Scheduled: "${topic}" in ${courseName} (${slots.length} slots) - starts ${dateStr}`;

          // Use the bulk student notifier (already in your notificationModel.js)
          await addNotificationForStudents(
            pool,
            messageStudent,
            'exam',
            'high',           // ← 'high' so it stands out (red dot if your UI supports it)
            studentIds
          );

          console.log(`Notified ${studentIds.length} students about new exam "${topic}"`);
        } else {
          console.log(`No students found in this center → no exam notifications sent`);
        }
      }
    } catch (notifyErr) {
      console.error('Student exam notification failed (non-blocking):', notifyErr.message);
      // Do NOT fail exam creation because of notification issue
    }

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      examId
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ success: false, error: 'Failed to create exam' });
  }
};

// Get all exams created by this faculty (with slots)
export const getFacultyExams = async (req, res) => {
  try {
    const facultyId = req.user.id;
    // Get all exams for this faculty
    const { rows: exams } = await pool.query(
      `SELECT e.id, e.topic, e.exam_link, e.total_marks, e.created_at, c.name AS course
       FROM exams e
       JOIN courses c ON e.course_id = c.id
       WHERE e.faculty_id = $1
       ORDER BY e.created_at DESC`,
      [facultyId]
    );

    // For each exam, get its slots and format as 'YYYY-MM-DD hh:mm AM/PM - hh:mm AM/PM'
    function formatTime(t) {
      const [h, m] = t.split(":");
      let hour = parseInt(h, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
    }
    for (const exam of exams) {
      const { rows: slots } = await pool.query(
        `SELECT date, start_time, end_time FROM exam_slots WHERE exam_id = $1 ORDER BY date, start_time`,
        [exam.id]
      );
      exam.dateTimeSlots = slots.map(s => {
        const date = s.date.toISOString().slice(0, 10);
        const start = formatTime(s.start_time);
        const end = formatTime(s.end_time);
        return `${date} ${start} - ${end}`;
      });
    }

    res.json({ success: true, exams });
  } catch (error) {
    console.error('Get faculty exams error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch exams' });
  }
};

// Get available exam link(s) for a course (for logged-in student)
export const getCourseExamLink = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const { rows } = await pool.query(`
      SELECT 
        e.id,
        e.topic,
        e.exam_link,
        e.total_marks,
        s.date,
        s.start_time,
        s.end_time,
        CASE 
          WHEN CURRENT_TIME BETWEEN s.start_time AND s.end_time 
          THEN true 
          ELSE false 
        END AS is_active_now
      FROM exams e
      JOIN exam_slots s ON e.id = s.exam_id
      WHERE e.course_id = $1
        AND s.date = CURRENT_DATE
        AND e.exam_link IS NOT NULL
        AND e.exam_link != ''
      LIMIT 1
    `, [courseId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam is active right now"
      });
    }

    const exam = rows[0];

    res.json({
      success: true,
      exam: {
        id: exam.id,
        topic: exam.topic,
        examLink: exam.exam_link,
        totalMarks: exam.total_marks,
        date: exam.date.toISOString().split('T')[0],
        startTime: exam.start_time,
        endTime: exam.end_time,
        is_active_now: exam.is_active_now
      }
    });
  } catch (error) {
    console.error('Get course exam link error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch exam link' });
  }
};

/// Student submits exam answer PDF (prevents multiple submissions)
export const submitExamAnswer = (req, res) => {
  uploadExamAnswer(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 5MB)' : err.message
      });
    } else if (err) {
      console.error('Upload error:', err.stack);
      return res.status(500).json({ success: false, error: 'File upload failed: ' + err.message });
    }

    try {
      console.log('Exam answer file uploaded (temp):', req.file ? req.file.filename : 'No file');

      const { examId } = req.body;
      const studentId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      if (!examId) {
        if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ success: false, error: 'examId is required' });
      }

      // ────────────────────────────────────────────────
      // CHECK IF STUDENT ALREADY SUBMITTED THIS EXAM
      // ────────────────────────────────────────────────
      const { rows: existing } = await pool.query(`
        SELECT id, answer_pdf_path 
        FROM exam_submissions 
        WHERE exam_id = $1 AND student_id = $2
      `, [examId, studentId]);

      if (existing.length > 0) {
        // Already submitted → reject and clean up temp file
        if (req.file?.path) {
          await fs.promises.unlink(req.file.path).catch(() => {});
        }
        return res.status(403).json({
          success: false,
          error: 'You have already submitted answers for this exam.'
        });
      }

      // ────────────────────────────────────────────────
      // Fetch faculty_id and total_marks from the exam
      // ────────────────────────────────────────────────
      const { rows: examData } = await pool.query(`
        SELECT faculty_id, total_marks 
        FROM exams 
        WHERE id = $1
      `, [examId]);

      if (examData.length === 0) {
        if (req.file?.path) await fs.promises.unlink(req.file.path).catch(() => {});
        return res.status(404).json({
          success: false,
          error: 'Exam not found'
        });
      }

      const { faculty_id, total_marks } = examData[0];

      // ────────────────────────────────────────────────
      // Proceed with insertion - include faculty_id and full_marks
      // ────────────────────────────────────────────────
      const answerPath = `exams/submissions/${req.file.filename}`;

      await pool.query(`
        INSERT INTO exam_submissions (
          exam_id, 
          student_id, 
          answer_pdf_path, 
          submitted_at,
          faculty_id,       -- copied from exams
          full_marks        -- copied from exams.total_marks
        )
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
      `, [examId, studentId, answerPath, faculty_id, total_marks]);

      res.json({ success: true, message: 'Exam answers submitted successfully' });
    } catch (error) {
      console.error('Submit exam answer error:', error.stack);
      if (req.file?.path) {
        await fs.promises.unlink(req.file.path).catch(() => {});
      }
      res.status(500).json({ 
        success: false, 
        error: 'Server error during submission: ' + (error.message || 'Unknown error') 
      });
    }
  });
};


// Get all submissions for a specific exam (with student names)
export const getExamSubmissions = async (req, res) => {
  try {
    const { examId } = req.params;
    const facultyId = req.user.id;

    // Security check
    const { rows: examCheck } = await pool.query(
      'SELECT id FROM exams WHERE id = $1 AND faculty_id = $2',
      [examId, facultyId]
    );

    if (examCheck.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized or exam not found'
      });
    }

    const { rows: submissions } = await pool.query(`
      SELECT 
        es.id,
        s.student_id AS student_code,          -- STU-2026-XXXX
        s.first_name || ' ' || s.last_name AS student_name,
        es.submitted_at,
        es.answer_pdf_path,
        es.full_marks,                         -- Now included
        es.marks,
        es.remarks,
        es.faculty_id                          -- Optional - included for completeness
      FROM exam_submissions es
      JOIN students s ON es.student_id = s.id
      WHERE es.exam_id = $1
      ORDER BY es.submitted_at DESC
    `, [examId]);

    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Get exam submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
};

// NEW: Update marks and remarks for a submission
export const updateExamSubmissionEvaluation = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, remarks } = req.body;
    const facultyId = req.user.id;

    // Security: verify faculty owns this submission's exam
    const { rows: check } = await pool.query(`
      SELECT es.id 
      FROM exam_submissions es
      JOIN exams e ON es.exam_id = e.id
      WHERE es.id = $1 AND e.faculty_id = $2
    `, [submissionId, facultyId]);

    if (check.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    await pool.query(
      `UPDATE exam_submissions 
       SET marks = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [marks || null, remarks || null, submissionId]
    );

    res.json({
      success: true,
      message: 'Evaluation updated successfully'
    });
  } catch (error) {
    console.error('Update exam submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update evaluation'
    });
  }
};

// Get all exam results for logged-in student 
export const getStudentExamResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;  // optional: filter by course if needed

    let query = `
      SELECT 
        es.id,
        es.submitted_at,
        es.full_marks,
        es.marks AS marks_obtained,
        es.remarks,
        es.answer_pdf_path,
        e.topic AS exam_name,
        c.name AS course_name
      FROM exam_submissions es
      JOIN exams e ON es.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE es.student_id = $1
    `;
    const params = [studentId];

    if (courseId) {
      query += ` AND e.course_id = $${params.length + 1}`;
      params.push(courseId);
    }

    query += ` ORDER BY es.submitted_at DESC`;

    const { rows } = await pool.query(query, params);

    res.json({
      success: true,
      results: rows
    });
  } catch (error) {
    console.error('Get student exam results error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch results' });
  }
};