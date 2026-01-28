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

export const createCourseWeeksTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS course_weeks (
      id          SERIAL PRIMARY KEY,
      course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title       VARCHAR(255) NOT NULL,        -- e.g. "Week 1 - Introduction"
      week_number INTEGER,                      -- optional week number
      "order"     INTEGER DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(course_id, "order")
    );

    CREATE INDEX IF NOT EXISTS idx_course_weeks_course_id 
      ON course_weeks(course_id);
  `);
  console.log('course_weeks table ready');
};

// Updated: Modules now belong to a week/section
export const createCourseModulesTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS course_modules (
      id          SERIAL PRIMARY KEY,
      week_id     INTEGER NOT NULL REFERENCES course_weeks(id) ON DELETE CASCADE,
      title       VARCHAR(255) NOT NULL,
      "order"     INTEGER DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_course_modules_week_id 
      ON course_modules(week_id);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS module_contents (
      id          SERIAL PRIMARY KEY,
      module_id   INTEGER NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
      title       VARCHAR(255) NOT NULL,
      type        VARCHAR(50) NOT NULL 
        CHECK (type IN ('video','quiz','assignment','document','live','other')),
      duration    VARCHAR(50),
      "order"     INTEGER DEFAULT 0,
      url         TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_module_contents_module_id 
      ON module_contents(module_id);
  `);

  console.log('course_modules & module_contents tables ready');
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

export const assessmentsTableSetup = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS course_assessments (
      id                  SERIAL PRIMARY KEY,
      
      -- Core relations
      course_id           INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      week_id             INTEGER REFERENCES course_weeks(id) ON DELETE SET NULL,       -- optional (NULL = course-level assessment)
      academic_admin_id   INTEGER NOT NULL REFERENCES academic_admins(id) ON DELETE CASCADE,
      faculty_id          INTEGER REFERENCES faculty(id) ON DELETE SET NULL,             -- who created it (NULL if admin creates)
      
      -- Assessment details
      title               VARCHAR(255) NOT NULL,
      description         TEXT,
      pdf_path            VARCHAR(255),
      total_marks         INTEGER NOT NULL CHECK (total_marks > 0),
      due_date            DATE,
      
      created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Prevent duplicate titles in same week/course
      CONSTRAINT unique_assessment_per_week UNIQUE(course_id, week_id, title)
    );

    -- Indexes for fast queries
    CREATE INDEX IF NOT EXISTS idx_assessments_course_week ON course_assessments(course_id, week_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_faculty ON course_assessments(faculty_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_academic ON course_assessments(academic_admin_id);
  `;

  await pool.query(query);
  console.log('course_assessments table recreated with proper relations');
};

// NEW: Assignment Submission Table (added here as requested)
export const assignmentSubmissionsTableSetup = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id              SERIAL PRIMARY KEY,
      assignment_id   INTEGER NOT NULL REFERENCES course_assessments(id) ON DELETE CASCADE,
      student_id      INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      answer_pdf_path TEXT NOT NULL,
      submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(assignment_id, student_id)
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_assignment 
      ON assignment_submissions(assignment_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_student 
      ON assignment_submissions(student_id);
  `;

  await pool.query(query);
  console.log('assignment_submissions table created or already exists');
};

// Run all course-related table setups (call this once on server start)
export const setupAllCourseRelatedTables = async () => {
  try {
    await createCoursesTable();
    await createCourseAcademicRelationTable();
    await createCourseWeeksTable();
    await createCourseModulesTables();
    await createAcademicCourseSchedulesTable();
    await assessmentsTableSetup();
    await assignmentSubmissionsTableSetup();  // ← This includes your requested table
    console.log('All course-related tables (including assignment_submissions) are ready.');
  } catch (error) {
    console.error('Error setting up course-related tables:', error);
    throw error;
  }
};

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

export const getCourseStructure = async (courseId) => {
  try {
    const weeksRes = await pool.query(`
      SELECT id, title, week_number AS "weekNumber", "order"
      FROM course_weeks
      WHERE course_id = $1
      ORDER BY "order" ASC, id ASC
    `, [courseId]);

    const weeks = weeksRes.rows;

    for (const week of weeks) {
      // Modules
      const modulesRes = await pool.query(`
        SELECT id, title, "order"
        FROM course_modules
        WHERE week_id = $1
        ORDER BY "order" ASC, id ASC
      `, [week.id]);

      week.modules = modulesRes.rows;

      for (const module of week.modules) {
        // Chapters / Contents
        const contentsRes = await pool.query(`
          SELECT id, title, type, duration, "order", url
          FROM module_contents
          WHERE module_id = $1
          ORDER BY "order" ASC, id ASC
        `, [module.id]);

        module.chapters = contentsRes.rows;
      }
    }

    return weeks;
  } catch (error) {
    // If course structure tables don't exist yet, just return empty array
    console.log('Course structure query failed (tables may not exist yet):', error.message);
    return [];
  }
};

export const addModule = async (courseId, title, order = 0) => {
  const { rows } = await pool.query(`
    INSERT INTO course_modules (course_id, title, "order")
    VALUES ($1, $2, $3)
    RETURNING *
  `, [courseId, title, order]);
  return rows[0];
};

export const addContentToModule = async (moduleId, {title, type, duration, url, order = 0}) => {
  const { rows } = await pool.query(`
    INSERT INTO module_contents (module_id, title, type, duration, url, "order")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [moduleId, title, type, duration, url || null, order]);
  return rows[0];
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

export const deleteModule = async (moduleId) => {
  await pool.query('DELETE FROM course_modules WHERE id = $1', [moduleId]);
  // cascade will delete contents
};

export const deleteContent = async (contentId) => {
  await pool.query('DELETE FROM module_contents WHERE id = $1', [contentId]);
};

export const replaceCourseStructure = async (courseId, newStructure) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete existing hierarchy (cascade will clean modules → contents)
    await client.query('DELETE FROM course_weeks WHERE course_id = $1', [courseId]);

    let weekOrder = 0;

    for (const week of newStructure) {
      const { rows: [insertedWeek] } = await client.query(`
        INSERT INTO course_weeks (course_id, title, week_number, "order")
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [
        courseId,
        week.name || week.title || 'Untitled Week',
        week.week ? parseInt(week.week) : null,
        weekOrder++
      ]);

      const weekId = insertedWeek.id;

      let moduleOrder = 0;
      for (const module of (week.modules || [])) {
        const { rows: [insertedModule] } = await client.query(`
          INSERT INTO course_modules (week_id, title, "order")
          VALUES ($1, $2, $3)
          RETURNING id
        `, [weekId, module.name || 'Untitled Module', moduleOrder++]);

        const moduleId = insertedModule.id;

        let chapterOrder = 0;
        for (const chapter of (module.chapters || [])) {
          if (!chapter || (typeof chapter === 'string' && !chapter.trim())) continue;

          const chap = typeof chapter === 'object' ? chapter : { title: chapter };

          await client.query(`
            INSERT INTO module_contents 
              (module_id, title, type, duration, "order", url)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            moduleId,
            chap.title || 'Untitled Chapter',
            chap.type || 'video',
            chap.duration || null,
            chapterOrder++,
            chap.url || null
          ]);
        }
      }
    }

    await client.query('COMMIT');
    return await getCourseStructure(courseId);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Replace course structure failed:', err);
    throw err;
  } finally {
    client.release();
  }
};