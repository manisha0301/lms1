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
      academic_name VARCHAR(255),
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
      academic_name AS "academicAdmins"
    FROM academic_admins
    ORDER BY created_at DESC
  `);
  return rows;
};

export const createAcademicAdmin = async (pool, adminData) => {
  const { fullName, email, mobile, role, academic_name, passwordHash, twoFactor } = adminData;
  const username = fullName.toLowerCase().replace(/\s+/g, '.');

  const { rows } = await pool.query(`
    INSERT INTO academic_admins (
      full_name, email, mobile, username, role, academic_name, 
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
      academic_name AS "academicAdmins"
  `, [fullName, email, mobile || null, username, role, academic_name, passwordHash, twoFactor]);

  return rows[0];
}; 

export const updateAcademicAdminPassword = async (pool, id, newPasswordHash) => {
  const { rows } = await pool.query(
    `UPDATE academic_admins 
     SET password_hash = $1 
     WHERE id = $2 
     RETURNING id, email, full_name`,
    [newPasswordHash, id]
  );
  return rows[0] || null;
};

export const createAcademicAdminDetailsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS academic_admin_details (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL UNIQUE,
        mobile VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        pincode VARCHAR(10),
        about TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_admin
          FOREIGN KEY (admin_id)
          REFERENCES academic_admins(id)
          ON DELETE CASCADE
      );
    `;
    await pool.query(query);
    console.log('academic_admin_details table created or already exists');
  } catch (error) {
    console.error('Error creating academic_admin_details table:', error);
  }
};