// backend/src/controllers/landingController.js

import pool from '../config/db.js';

export const getAllPublicCourses = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        image AS thumbnail,
        price,
        duration,
        type,
        description
      FROM courses
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      courses: rows
    });

  } catch (error) {
    console.error('getAllPublicCourses error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
};

export const getPublicCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        image AS thumbnail,
        price,
        duration,
        type,
        description
      FROM courses
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course: rows[0]
    });

  } catch (error) {
    console.error('getPublicCourseById error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
};

export const getPublicCourseOverview = async (req, res) => {
  try {
    const { id } = req.params;

    // Course basic info
    const { rows: courseRows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        description,
        image AS thumbnail,
        price,
        duration,
        type AS is_live
      FROM courses
      WHERE id = $1
    `, [id]);

    if (courseRows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const course = courseRows[0];

    // Course content: weeks → modules → chapters (titles only)
    const { rows: weeks } = await pool.query(`
      SELECT 
        cw.id AS week_id,
        cw.week_number,
        cw.title AS week_title
      FROM course_weeks cw
      WHERE cw.course_id = $1
      ORDER BY cw.week_number ASC
    `, [id]);

    const content = [];

    for (const week of weeks) {
      const { rows: modules } = await pool.query(`
        SELECT 
          cm.id AS module_id,
          cm.title AS module_title
        FROM course_modules cm
        WHERE cm.week_id = $1
        ORDER BY cm.order ASC
      `, [week.week_id]);

      const weekItem = {
        id: week.week_id,
        name: `Week ${week.week_number} - ${week.week_title || "Untitled"}`,
        modules: []
      };

      for (const mod of modules) {
        const { rows: chapters } = await pool.query(`
          SELECT 
            mc.title AS chapter_title
          FROM module_contents mc
          WHERE mc.module_id = $1
          ORDER BY mc.order ASC
        `, [mod.module_id]);

        weekItem.modules.push({
          id: mod.module_id,
          name: mod.module_title,
          chapters: chapters.map(c => ({ title: c.chapter_title }))
        });
      }

      content.push(weekItem);
    }

    res.json({
      success: true,
      course,
      content
    });

  } catch (error) {
    console.error('getPublicCourseOverview error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get top 4 highest-rated public courses (fixed: real prices, average rating, thumbnail)
export const getTopRatedCourses = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.name AS title,
        c.image AS thumbnail,
        c.price,
        c.original_price AS "originalPrice",
        c.duration,
        COUNT(r.id) AS "ratingCount",
        COALESCE(AVG(r.rating), 0) AS rating          -- send as "rating"
      FROM courses c
      LEFT JOIN public.ratings r ON c.id = r.course_id
      GROUP BY 
        c.id, c.name, c.image, c.price, c.original_price, c.duration
      HAVING COUNT(r.id) > 0
      ORDER BY rating DESC, "ratingCount" DESC, c.id DESC
      LIMIT 4
    `;

    const { rows } = await pool.query(query);

    console.log("Raw top-rated rows:", rows); // debug

    const formattedCourses = rows.map(course => ({
      id: course.id,
      title: course.title,
      price: parseFloat(course.price) || 0,
      originalPrice: parseFloat(course.originalPrice) || 0,
      duration: course.duration || "N/A",
      students: Math.floor(Math.random() * 4000) + 500,
      rating: parseFloat(course.rating).toFixed(1),   // real average
      ratingCount: parseInt(course.ratingCount),
      thumbnail: course.thumbnail 
        ? `/uploads/${course.thumbnail}` 
        : null   // frontend will handle null
    }));

    res.json({
      success: true,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('getTopRatedCourses error:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated courses',
      error: error.message
    });
  }
};