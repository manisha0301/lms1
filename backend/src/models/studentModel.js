// backend/src/models/studentModel.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createStudentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
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
  console.log('students table created or already exists');
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

  const query = `
    INSERT INTO students (
      first_name, last_name, email, mobile_number, password, graduation_university
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, first_name, last_name, email, mobile_number, graduation_university, created_at;
  `;

  const values = [
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