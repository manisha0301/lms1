// backend/renameThumbnails.js
import pool from './src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

async function renameThumbnails() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('uploads folder not found');
    return;
  }

  console.log('Starting thumbnail rename migration...');

  const { rows: courses } = await pool.query(`
    SELECT id, name, image 
    FROM courses 
    WHERE image IS NOT NULL AND image != ''
  `);

  for (const course of courses) {
    const oldFilename = course.image;
    const oldPath = path.join(uploadsDir, oldFilename);

    if (!fs.existsSync(oldPath)) {
      console.log(`Warning: File not found: ${oldFilename} (course: ${course.name})`);
      continue;
    }

    // Create clean slug from course name
    let slug = course.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')      // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, '');         // trim dashes

    if (!slug) slug = `course-${course.id}`;

    const ext = path.extname(oldFilename).toLowerCase() || '.jpg';
    let newFilename = `${slug}${ext}`;

    // Handle duplicates
    let counter = 1;
    let finalName = newFilename;
    while (fs.existsSync(path.join(uploadsDir, finalName)) && finalName !== oldFilename) {
      finalName = `${slug}-${counter}${ext}`;
      counter++;
    }

    const newPath = path.join(uploadsDir, finalName);

    // Rename file
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${oldFilename} → ${finalName}`);

    // Update database
    await pool.query('UPDATE courses SET image = $1 WHERE id = $2', [finalName, course.id]);
  }

  console.log('Thumbnail migration completed successfully!');
  process.exit(0);
}

renameThumbnails().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});