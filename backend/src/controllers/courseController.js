// backend/src/controllers/courseController.js
import pool from '../config/db.js';
import {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourseContents
} from '../models/courseModel.js';
import { addNotificationForSuperAdmin } from '../models/notificationModel.js';

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { name, type, price, duration, description, originalPrice } = req.body;
    const image = req.file ? req.file.filename : null;

    // Parse optional JSON fields safely
    let teachers = [];
    let batches = [];
    try {
      teachers = req.body.teachers ? JSON.parse(req.body.teachers) : [];
      batches = req.body.batches ? JSON.parse(req.body.batches) : [];
    } catch (e) {
      // ignore parse errors
    }

    // Handle originalPrice - only if manually provided (no auto 2x)
    let finalOriginalPrice = null;
    if (originalPrice && originalPrice.trim() !== "") {
      finalOriginalPrice = parseFloat(originalPrice);
    }

    const newCourse = await addCourse({
      image,
      name,
      type: type || 'Live',
      price: parseFloat(price),
      duration: duration || null,
      description: description || '',
      teachers,
      batches,
      originalPrice: finalOriginalPrice
    });

    const notifyMessage = `New course created: "${newCourse.name}" (${newCourse.type}, ₹${newCourse.price})`;
    await addNotificationForSuperAdmin(
      pool,
      notifyMessage,
      'course',       // you can define new type if you want different styling
      'medium'
    );

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, error: 'Failed to add course' });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    console.error('Get single course error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update course contents
export const updateContents = async (req, res) => {
  try {
    const { contents } = req.body;
    const updatedCourse = await updateCourseContents(req.params.id, contents);
    if (!updatedCourse) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Update contents error:', error);
    res.status(500).json({ success: false, error: 'Failed to update contents' });
  }
};

export const getAcademicAdminsForAssign = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, full_name, email, academic_name AS institution
      FROM academic_admins 
      WHERE status = 'Active' 
      ORDER BY full_name ASC
    `);
    res.json({ success: true, admins: rows });
  } catch (error) {
    console.error('Error fetching academic admins for assign:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch academic admins' });
  }
};

export const assignCourseToAdmins = async (req, res) => {
  try {
    const { courseId, adminIds } = req.body;

    if (!courseId || !Array.isArray(adminIds)) {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    // Get current assignments for this course
    const { rows: current } = await pool.query(
      'SELECT academic_admin_id FROM course_academic_assignments WHERE course_id = $1',
      [courseId]
    );
    const currentIds = current.map(row => row.academic_admin_id);

    // Find what to add and what to remove
    const toAdd = adminIds.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !adminIds.includes(id));

    // Remove unchecked ones
    if (toRemove.length > 0) {
      await pool.query(
        'DELETE FROM course_academic_assignments WHERE course_id = $1 AND academic_admin_id = ANY($2::int[])',
        [courseId, toRemove]
      );
    }

    // Add new checked ones
    if (toAdd.length > 0) {
      const values = toAdd.map(id => `(${courseId}, ${id})`).join(',');
      await pool.query(`
        INSERT INTO course_academic_assignments (course_id, academic_admin_id)
        VALUES ${values}
        ON CONFLICT (course_id, academic_admin_id) DO NOTHING
      `);
    }

    // Get course name for nice message
    const { rows: [course] } = await pool.query(
      'SELECT name FROM courses WHERE id = $1',
      [courseId]
    );

    if (course) {
      const adminCount = Array.isArray(adminIds) ? adminIds.length : 1;
      const message = `Course "${course.name}" assigned to ${adminCount} academic admin${adminCount !== 1 ? 's' : ''}`;

      await addNotificationForSuperAdmin(pool, message, 'course', 'medium');
    }

    res.json({ success: true, message: 'Assignment updated successfully!' });
  } catch (error) {
    console.error('Assign course error:', error);
    res.status(500).json({ success: false, error: 'Failed to update assignment' });
  }
};

export const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rows } = await pool.query(
      'SELECT academic_admin_id FROM course_academic_assignments WHERE course_id = $1',
      [courseId]
    );
    const ids = rows.map(r => r.academic_admin_id);
    res.json({ success: true, assignedIds: ids });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed' });
  }
};

export const getCoursesForManagement = async (req, res) => {
  try {
    const { rows: academicsData } = await pool.query(`
      SELECT 
        aa.id as "academicId",
        aa.full_name as "academicName",
        aa.email as "academicEmail",
        aa.academic_name as center,
        COUNT(DISTINCT caa.course_id) as "totalCourses",
        0 as "totalStudents",  -- Placeholder - requires enrollments table
        0 as "totalRevenue",   -- Placeholder
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', c.id,
              'title', c.name,
              'code', UPPER(SPLIT_PART(c.name, ' ', 1)) || '-' || UPPER(SPLIT_PART(aa.full_name, ' ', 1)) || '-25A',
              'faculty', 'Faculty TBD',
              'facultyEmail', 'faculty@kristellar.com',
              'duration', c.duration,
              'startDate', COALESCE((c.batches->0->>'startDate')::text, '2025-01-01'),
              'totalStudents', 0,
              'activeStudents', 0,
              'examsConducted', 0,
              'totalExams', 0,
              'completedAssignments', 0,
              'totalAssignments', 0,
              'avgAttendance', 0,
              'revenue', 0,
              'status', 'Ongoing',
              'batchSize', 350,
              'completionRate', 87,
              'topPerformer', 'Rohan Mehta',
              'lastActivity', '2 hours ago'
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::jsonb
        ) as courses
      FROM academic_admins aa
      LEFT JOIN course_academic_assignments caa ON aa.id = caa.academic_admin_id
      LEFT JOIN courses c ON c.id = caa.course_id
      WHERE aa.status = 'Active'
      GROUP BY aa.id
      ORDER BY aa.full_name ASC
    `);

    res.json({ success: true, academicsData });

  } catch (error) {
    console.error('Get courses management error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch management data' });
  }
};