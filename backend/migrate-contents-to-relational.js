// Run this ONCE — can be in a separate file or temporary endpoint

import pool from './src/config/db.js';

async function migrateContentsToRelational() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get all courses that have contents
    const { rows: courses } = await client.query(`
      SELECT id, contents 
      FROM courses 
      WHERE contents IS NOT NULL 
        AND jsonb_array_length(contents) > 0
    `);

    for (const course of courses) {
      const courseId = course.id;
      const modules = course.contents; // array of {id, title, chapters: [...]}

      let moduleOrder = 0;

      for (const mod of modules) {
        // Insert module
        const { rows: [newModule] } = await client.query(`
          INSERT INTO course_modules (course_id, title, "order")
          VALUES ($1, $2, $3)
          RETURNING id
        `, [courseId, mod.title, moduleOrder++]);

        const moduleId = newModule.id;

        let contentOrder = 0;

        for (const ch of (mod.chapters || [])) {
          await client.query(`
            INSERT INTO module_contents 
              (module_id, title, type, duration, "order")
            VALUES ($1, $2, $3, $4, $5)
          `, [
            moduleId,
            ch.title,
            ch.type || 'video',
            ch.duration || null,
            contentOrder++
          ]);
        }
      }
    }

    await client.query('COMMIT');
    console.log(`Migrated ${courses.length} courses successfully`);

    // Optional: drop old column AFTER successful migration & backup!
    await client.query('ALTER TABLE courses DROP COLUMN contents;');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
  }
}

migrateContentsToRelational().then(() => process.exit(0));