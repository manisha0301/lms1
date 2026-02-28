// src/models/examModel.js
import pool from '../config/db.js';

export const createExamsTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        faculty_id INTEGER REFERENCES faculty(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        topic VARCHAR(255) NOT NULL,
        exam_link TEXT,
        total_marks INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_slots (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_submissions (
        id BIGSERIAL PRIMARY KEY,
        exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        answer_pdf_path TEXT NOT NULL,
        submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        marks INTEGER,
        remarks TEXT,
        faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL,
        full_marks INTEGER,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_exam_student UNIQUE (exam_id, student_id)
      );
    `);

    await pool.query(`
      ALTER TABLE exam_submissions 
      ADD COLUMN IF NOT EXISTS faculty_id INTEGER REFERENCES faculty(id) ON DELETE SET NULL;
    `);

    await pool.query(`
      ALTER TABLE exam_submissions 
      ADD COLUMN IF NOT EXISTS full_marks INTEGER;
    `);

    // 🔥 AUTO FIX OLD DATA (IMPORTANT)
    await pool.query(`
      UPDATE exam_submissions es
      SET 
        full_marks = e.total_marks,
        faculty_id = e.faculty_id
      FROM exams e
      WHERE es.exam_id = e.id
        AND (es.full_marks IS NULL OR es.full_marks = 0 OR es.faculty_id IS NULL);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam_student 
      ON exam_submissions(exam_id, student_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_exam_submissions_faculty 
      ON exam_submissions(faculty_id);
    `);

    console.log('Exams tables created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating exams tables:', error);
  }
};