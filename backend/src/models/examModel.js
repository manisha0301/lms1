// src/models/examModel.js
import pool from '../config/db.js';

export const createExamsTables = async () => {
  try {
    // Main Exams table
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
    // Remove status column if it exists
    await pool.query(`
      ALTER TABLE exams DROP COLUMN IF EXISTS status;
    `);

    // Exam Slots (multiple per exam)
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

    console.log('Exams & exam_slots tables created or already exist');
  } catch (error) {
    console.error('Error creating exams tables:', error);
  }
};