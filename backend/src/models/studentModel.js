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
  const { rows: countRes } = await pool.query(
    `SELECT COUNT(*) FROM students 
     WHERE EXTRACT(YEAR FROM created_at) = $1`,
    [year]
  );
  const count = parseInt(countRes[0].count, 10) + 1;
  const studentId = `STU-${year}-${String(count).padStart(4, '0')}`;

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