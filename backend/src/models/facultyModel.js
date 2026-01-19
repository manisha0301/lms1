// backend/src/models/facultyModel.js
import pool from '../config/db.js';

export const createFacultyTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS faculty (
      id SERIAL PRIMARY KEY,
      academic_admin_id INTEGER REFERENCES academic_admins(id) ON DELETE SET NULL,
      code VARCHAR(20) UNIQUE,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      designation VARCHAR(100),
      qualification VARCHAR(100),
      employment_status VARCHAR(50) DEFAULT 'Employed',
      password_hash TEXT NOT NULL,
      profile_picture VARCHAR(255),
      status VARCHAR(20) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      approved_at TIMESTAMP,
      approved_by INTEGER
    );

    -- Sequence for auto-generating FAC001, FAC002...
    CREATE SEQUENCE IF NOT EXISTS faculty_code_seq START WITH 1 INCREMENT BY 1;

    -- Function to auto-generate code
    CREATE OR REPLACE FUNCTION generate_faculty_code()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.code := 'FAC' || LPAD(nextval('faculty_code_seq')::TEXT, 3, '0');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger to run the function on insert
    DROP TRIGGER IF EXISTS trigger_faculty_code ON faculty;
    CREATE TRIGGER trigger_faculty_code
    BEFORE INSERT ON faculty
    FOR EACH ROW
    EXECUTE FUNCTION generate_faculty_code();
  `;

  try {
    await pool.query(query);
    console.log('faculty table created or already exists');
  } catch (error) {
    console.error('Error creating faculty table:', error);
  }
};

export const addFaculty = async ({
  full_name,
  email,
  phone,
  address,
  designation,
  qualification,
  employment_status,
  password_hash,
  profile_picture,
  status,
  academic_admin_id
}) => {
  const query = `
    INSERT INTO faculty (
      full_name, email, phone, address, designation, qualification,
      employment_status, password_hash, profile_picture, status, academic_admin_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING 
      id, code, full_name, email, phone, address, designation, 
      qualification, employment_status, profile_picture, status, academic_admin_id, created_at
  `;

  const values = [
    full_name,
    email,
    phone || null,
    address || null,
    designation || null,
    qualification || null,
    employment_status || 'Employed',
    password_hash,
    profile_picture || null,
    status,
    academic_admin_id || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllFaculty = async () => {
  const { rows } = await pool.query(`
    SELECT 
      id, code, full_name AS name, email, phone, address,
      designation, qualification, employment_status,
      profile_picture, status, created_at
    FROM faculty
    WHERE status = 'Active'
    ORDER BY created_at DESC
  `);
  return rows;
};

export const getPendingFaculty = async () => {
  const { rows } = await pool.query(`
    SELECT 
      id, code, full_name AS name, email, phone,
      designation, qualification
    FROM faculty
    WHERE status = 'Pending'
    ORDER BY created_at DESC
  `);
  return rows;
};

export const getAllFacultyWithStatus = async () => {
  const { rows } = await pool.query(`
    SELECT 
      id, code, full_name AS name, email, phone, address,
      designation, qualification, employment_status,
      profile_picture, status, created_at
    FROM faculty
    ORDER BY created_at DESC
  `);
  return rows;
};

export const approveFaculty = async (facultyId, approverId) => {
  const query = `
    UPDATE faculty 
    SET status = 'Active', approved_at = CURRENT_TIMESTAMP, approved_by = $2
    WHERE id = $1
    RETURNING id, code, full_name AS name, status
  `;
  const { rows } = await pool.query(query, [facultyId, approverId]);
  return rows[0];
};

export const rejectFaculty = async (facultyId) => {
  const query = `
    UPDATE faculty 
    SET status = 'Rejected'
    WHERE id = $1
    RETURNING id, code, full_name AS name, status
  `;
  const { rows } = await pool.query(query, [facultyId]);
  return rows[0];
};

export const updateFaculty = async (facultyId, updates) => {
  const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
  const values = [facultyId, ...Object.values(updates)];
  
  const query = `
    UPDATE faculty 
    SET ${fields}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteFaculty = async (facultyId) => {
  const { rows } = await pool.query(
    'DELETE FROM faculty WHERE id = $1 RETURNING id',
    [facultyId]
  );
  return rows[0];
};