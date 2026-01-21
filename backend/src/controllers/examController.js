// src/controllers/examController.js
import pool from '../config/db.js';

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