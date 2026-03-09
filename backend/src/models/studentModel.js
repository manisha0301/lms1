// backend/src/models/studentModel.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createStudentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      student_id VARCHAR(20) UNIQUE,           -- NEW: STU-YYYY-NNNN
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      mobile_number VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      graduation_university VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);

  // Safe migration: add student_id column if it doesn't exist yet
  await pool.query(`
    ALTER TABLE students 
    ADD COLUMN IF NOT EXISTS student_id VARCHAR(20) UNIQUE;
  `);

  console.log('students table created/updated with student_id column');
};

export const createStudent = async ({
  firstName,
  lastName,
  email,
  mobileNumber,
  password,
  graduationUniversity
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate student_id: STU-YYYY-NNNN
  const year = new Date().getFullYear();

  // Get count of students created in this year (for sequential number)
  const { rows: lastStudent } = await pool.query(
    `SELECT student_id 
    FROM students 
    WHERE student_id LIKE $1
    ORDER BY id DESC 
    LIMIT 1`,
    [`STU-${year}-%`]
  );

  let nextNumber = 1;

  if (lastStudent.length > 0) {
    const lastId = lastStudent[0].student_id; // STU-2026-0007
    const lastNumber = parseInt(lastId.split("-")[2], 10);
    nextNumber = lastNumber + 1;
  }

  const studentId = `STU-${year}-${String(nextNumber).padStart(4, '0')}`;

  const query = `
    INSERT INTO students (
      student_id, first_name, last_name, email, mobile_number, password, graduation_university
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING 
      id, 
      student_id, 
      first_name, 
      last_name, 
      email, 
      mobile_number, 
      graduation_university, 
      created_at;
  `;

  const values = [
    studentId,
    firstName,
    lastName,
    email,
    mobileNumber,
    hashedPassword,
    graduationUniversity || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findStudentByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM students WHERE email = $1', [email]);
  return rows[0] || null;
};

export const findStudentByMobile = async (mobileNumber) => {
  const { rows } = await pool.query('SELECT * FROM students WHERE mobile_number = $1', [mobileNumber]);
  return rows[0] || null;
};

export const createRatingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      academic_admin_id INTEGER NOT NULL REFERENCES academic_admins(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, course_id)  -- One rating per student per course
    );
  `;
  await pool.query(query);
  console.log('Ratings table created');
};