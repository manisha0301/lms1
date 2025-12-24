// src/models/academicAdminModel.js
import pool from '../config/db.js';

export const createAcademicAdminsTable = async (pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS academic_admins (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      mobile VARCHAR(20),
      username VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      branch VARCHAR(255),
      password_hash TEXT NOT NULL,
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );
  `;
  await pool.query(query);

  // If the table previously had a "department" column, drop it to keep schema consistent
  await pool.query('ALTER TABLE academic_admins DROP COLUMN IF EXISTS department');

  console.log('academic_admins table created/normalized');
};

export const findAllAcademicAdmins = async (pool) => {
  const { rows } = await pool.query(`
    SELECT 
      id, 
      full_name AS "fullName", 
      email, 
      mobile, 
      username, 
      role, 
      status, 
      branch AS "academicAdmins"
    FROM academic_admins
    ORDER BY created_at DESC
  `);
  return rows;
};

export const createAcademicAdmin = async (pool, adminData) => {
  const { fullName, email, mobile, role, branch, passwordHash, twoFactor } = adminData;
  const username = fullName.toLowerCase().replace(/\s+/g, '.');

  const { rows } = await pool.query(`
    INSERT INTO academic_admins (
      full_name, email, mobile, username, role, branch, 
      password_hash, two_factor_enabled
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING 
      id, 
      full_name AS "fullName", 
      email, 
      mobile, 
      username, 
      role, 
      status, 
      branch AS "academicAdmins"
  `, [fullName, email, mobile || null, username, role, branch, passwordHash, twoFactor]);

  return rows[0];
}; 