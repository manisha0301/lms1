// backend/src/models/courseModel.js
import pool from '../config/db.js';

export const createCoursesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      image VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) DEFAULT 'Live',
      price DECIMAL(10,2) NOT NULL,
      duration VARCHAR(100),
      description TEXT,
      teachers INTEGER[] DEFAULT '{}',
      batches JSONB DEFAULT '[]',
      contents JSONB DEFAULT '[]',
      original_price DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('courses table created or already exists');
};

export const createCourseAcademicRelationTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS course_academic_assignments (
      id SERIAL PRIMARY KEY,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      academic_admin_id INTEGER REFERENCES academic_admins(id) ON DELETE CASCADE,
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(course_id, academic_admin_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_assignments_course ON course_academic_assignments(course_id);
    CREATE INDEX IF NOT EXISTS idx_assignments_admin ON course_academic_assignments(academic_admin_id);
  `;
  await pool.query(query);
  console.log('course_academic_assignments table created or already exists');
}

export const addCourse = async ({
  image,
  name,
  type,
  price,
  duration,
  description,
  teachers,
  batches,
  originalPrice
}) => {
  const query = `
    INSERT INTO courses (
      image, name, type, price, duration, description,
      teachers, batches, original_price
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    image,
    name,
    type,
    price,
    duration,
    description || '',
    teachers || [],
    batches || [],
    originalPrice || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllCourses = async () => {
  const { rows } = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
  return rows;
};

export const getCourseById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
  return rows[0] || null;
};

export const updateCourseContents = async (courseId, contents) => {
  const { rows } = await pool.query(
    'UPDATE courses SET contents = $1::jsonb WHERE id = $2 RETURNING *',
    [JSON.stringify(contents), courseId]
  );
  return rows[0];
};

// Create table for per-admin batch schedule + meeting link
export const createAcademicCourseSchedulesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS academic_course_schedules (
      id SERIAL PRIMARY KEY,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      academic_admin_id INTEGER REFERENCES academic_admins(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      meeting_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(course_id, academic_admin_id)  -- One entry per admin per course
    );
  `;
  await pool.query(query);
  console.log('academic_course_schedules table created or already exists');
};

// Get schedule for specific admin + course
export const getAcademicCourseSchedule = async (courseId, academicAdminId) => {
  const { rows } = await pool.query(
    'SELECT * FROM academic_course_schedules WHERE course_id = $1 AND academic_admin_id = $2',
    [courseId, academicAdminId]
  );
  return rows[0] || null;
};

// Create or update schedule (including meeting link)
export const updateAcademicCourseSchedule = async ({ 
  courseId, 
  academicAdminId, 
  startDate, 
  endDate, 
  startTime, 
  endTime, 
  meetingLink 
}) => {
  const { rows } = await pool.query(`
    INSERT INTO academic_course_schedules (
      course_id, academic_admin_id, start_date, end_date, start_time, end_time, meeting_link
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (course_id, academic_admin_id)
    DO UPDATE SET
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      meeting_link = EXCLUDED.meeting_link,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `, [courseId, academicAdminId, startDate, endDate, startTime, endTime, meetingLink || null]);

  return rows[0];
};