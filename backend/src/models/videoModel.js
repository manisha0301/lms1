// backend/src/models/videoModel.js
import pool from '../config/db.js';
import path from 'path';
import fs from 'fs/promises';

export const createChapterVideosTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS chapter_videos (
      id                  SERIAL PRIMARY KEY,
      academic_admin_id   INTEGER NOT NULL REFERENCES academic_admins(id) ON DELETE CASCADE,
      faculty_id          INTEGER NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
      course_id           INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      week_id             INTEGER NOT NULL REFERENCES course_weeks(id) ON DELETE CASCADE,
      module_id           INTEGER NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
      chapter_id          INTEGER NOT NULL REFERENCES module_contents(id) ON DELETE CASCADE,

      video_title         VARCHAR(255),
      video_filename      VARCHAR(255) NOT NULL,
      video_path          TEXT NOT NULL,
      mime_type           VARCHAR(100),
      file_size_bytes     BIGINT,
      duration            VARCHAR(50),
      views_count         INTEGER DEFAULT 0,
      is_published        BOOLEAN DEFAULT FALSE,

      created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT unique_video_per_chapter UNIQUE (chapter_id)
    );

    CREATE INDEX IF NOT EXISTS idx_chapter_videos_chapter 
      ON chapter_videos(chapter_id);

    CREATE INDEX IF NOT EXISTS idx_chapter_videos_course 
      ON chapter_videos(course_id);

    CREATE INDEX IF NOT EXISTS idx_chapter_videos_faculty 
      ON chapter_videos(faculty_id);

    CREATE INDEX IF NOT EXISTS idx_chapter_videos_academic 
      ON chapter_videos(academic_admin_id);
  `;

  await pool.query(query);
  console.log('chapter_videos table created or already exists');
};

export const addVideoToChapter = async ({
  academicAdminId,
  facultyId,
  courseId,
  weekId,
  moduleId,
  chapterId,
  videoTitle,
  videoFilename,
  videoPath,
  mimeType,
  fileSizeBytes,
  duration = null,
}) => {
  const query = `
      INSERT INTO chapter_videos (
        academic_admin_id, faculty_id, course_id, week_id, module_id, chapter_id,
        video_title, video_filename, video_path, mime_type, file_size_bytes, duration,
        is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
      ON CONFLICT (chapter_id)
      DO UPDATE SET
        video_title     = EXCLUDED.video_title,
        video_filename  = EXCLUDED.video_filename,
        video_path      = EXCLUDED.video_path,
        mime_type       = EXCLUDED.mime_type,
        file_size_bytes = EXCLUDED.file_size_bytes,
        duration        = EXCLUDED.duration,
        is_published    = true,
        updated_at      = CURRENT_TIMESTAMP
      RETURNING id, video_path, video_title, created_at;
    `;


  const values = [
    academicAdminId,
    facultyId,
    courseId,
    weekId,
    moduleId,
    chapterId,
    videoTitle || 'Untitled Video',
    videoFilename,
    videoPath,
    mimeType,
    fileSizeBytes,
    duration,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getVideoByChapter = async (chapterId) => {
  const query = `
    SELECT 
      id, video_title, video_filename, video_path,
      mime_type, duration, views_count, is_published,
      created_at, updated_at
    FROM chapter_videos
    WHERE chapter_id = $1
      AND is_published = true
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [chapterId]);
  return rows[0] || null;
};


export const deleteVideoByChapter = async (chapterId, facultyId) => {
  const { rows } = await pool.query(
    'SELECT video_path FROM chapter_videos WHERE chapter_id = $1 AND faculty_id = $2',
    [chapterId, facultyId]
  );

  if (rows.length > 0) {
    const fullPath = path.join(process.cwd(), rows[0].video_path);
    try {
      await fs.unlink(fullPath);
      console.log(`Deleted video file: ${fullPath}`);
    } catch (err) {
      console.warn(`Could not delete video file: ${fullPath}`, err.message);
    }
  }

  await pool.query(
    'DELETE FROM chapter_videos WHERE chapter_id = $1 AND faculty_id = $2',
    [chapterId, facultyId]
  );
};

export const setupVideoTables = async () => {
  try {
    await createChapterVideosTable();
    console.log('Video tables setup complete.');
  } catch (err) {
    console.error('Video table setup failed:', err);
    throw err;
  }
};

