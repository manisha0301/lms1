// backend/src/controllers/courseController.js
import pool from '../config/db.js';
import {
  addCourse,
  getAllCourses,
  getCourseById,
  getCourseStructure,
  replaceCourseStructure,
  getAcademicCourseSchedule,
  updateAcademicCourseSchedule
} from '../models/courseModel.js';
import { addNotificationForSuperAdmin } from '../models/notificationModel.js';

// Create new course
export const createCourse = async (req, res) => {
  try {
    const { name, type, price, duration, description, originalPrice } = req.body;
    const image = req.file ? req.file.filename : null;

    let teachers = [];
    let batches = [];
    try {
      teachers = req.body.teachers ? JSON.parse(req.body.teachers) : [];
      batches = req.body.batches ? JSON.parse(req.body.batches) : [];
    } catch (e) {
      // ignore parse errors
    }

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
      'course',
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


// Get single course – NOW WITH REAL BATCH SCHEDULE & MEETING LINK
// Get single course – DYNAMIC DAILY SESSIONS (same time/link, different dates)
export const getCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    course.contents = await getCourseStructure(course.id);

    // Real faculty/instructor names
    let instructors = "No faculty assigned";
    if (course.teachers && course.teachers.length > 0) {
      const { rows: facultyRows } = await pool.query(
        'SELECT full_name FROM faculty WHERE id = ANY($1)',
        [course.teachers]
      );
      instructors = facultyRows.map(f => f.full_name).join(", ") || "No faculty assigned";
    }
    course.instructors = instructors;

    // Real enrolled students count (safe fallback)
    let enrolledCount = 0;
    try {
      const { rows: [countRow] } = await pool.query(
        'SELECT COUNT(*) as count FROM enrollments WHERE course_id = $1 AND status = $2',
        [course.id, 'PAID']
      );
      enrolledCount = parseInt(countRow?.count) || 0;
    } catch (err) {
      console.log('Enrollments count failed (table may not exist):', err.message);
    }
    course.enrolledStudents = enrolledCount;

    // ── DYNAMIC DAILY LIVE SESSIONS: Generate from start_date to end_date ────────────────────────────────
    const { rows: [schedule] } = await pool.query(`
      SELECT start_date, end_date, start_time, end_time, meeting_link
      FROM academic_course_schedules
      WHERE course_id = $1
      LIMIT 1
    `, [course.id]);

    let liveClasses = [];
    const today = new Date();

    if (schedule && schedule.start_date && schedule.end_date) {
      const start = new Date(schedule.start_date);
      const end = new Date(schedule.end_date);
      const timeSlot = schedule.start_time && schedule.end_time 
        ? `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}` 
        : 'Time TBA';
      const meetingLink = schedule.meeting_link || '#';

      // If course has already ended
      if (today > end) {
        liveClasses = [{
          topic: 'Live classes for this course have ended',
          instructor: instructors,
          date: 'Course Completed',
          time: '',
          link: '#'
        }];
      } else {
        // Generate one daily session from start to end
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const currentDate = new Date(d);

          liveClasses.push({
            topic: `Daily Live Class - ${course.name}`,
            instructor: instructors,
            date: currentDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            time: timeSlot,
            link: meetingLink
          });
        }
      }
    }

    // Fallback if no schedule exists
    if (liveClasses.length === 0) {
      liveClasses = [{
        topic: 'No live classes scheduled for this course',
        instructor: 'TBA',
        date: 'TBA',
        time: 'TBA',
        link: '#'
      }];
    }

    course.liveClasses = liveClasses;

    res.json({ success: true, course });
  } catch (error) {
    console.error('Get single course error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


// Update course contents (now relational)
export const updateContents = async (req, res) => {
  try {
    const { contents } = req.body;

    if (!Array.isArray(contents)) {
      return res.status(400).json({ success: false, error: 'Contents must be an array of modules' });
    }

    const updatedStructure = await replaceCourseStructure(req.params.id, contents);

    await addNotificationForSuperAdmin(
      pool,
      `Course structure updated for course ID ${req.params.id}`,
      'course',
      'low'
    );

    res.json({ 
      success: true, 
      message: 'Course structure updated successfully',
      contents: updatedStructure
    });
  } catch (error) {
    console.error('Update contents error:', error);
    res.status(500).json({ success: false, error: 'Failed to update course structure' });
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

    const { rows: current } = await pool.query(
      'SELECT academic_admin_id FROM course_academic_assignments WHERE course_id = $1',
      [courseId]
    );
    const currentIds = current.map(row => row.academic_admin_id);

    const toAdd = adminIds.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !adminIds.includes(id));

    if (toRemove.length > 0) {
      await pool.query(
        'DELETE FROM course_academic_assignments WHERE course_id = $1 AND academic_admin_id = ANY($2::int[])',
        [courseId, toRemove]
      );
    }

    if (toAdd.length > 0) {
      const values = toAdd.map(id => `(${courseId}, ${id})`).join(',');
      await pool.query(`
        INSERT INTO course_academic_assignments (course_id, academic_admin_id)
        VALUES ${values}
        ON CONFLICT (course_id, academic_admin_id) DO NOTHING
      `);
    }

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
        0 as "totalStudents",
        0 as "totalRevenue",
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', c.id,
              'title', c.name,
              'code', UPPER(SPLIT_PART(c.name, ' ', 1)) || '-' || UPPER(SPLIT_PART(aa.full_name, ' ', 1)) || '-25A',
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
              'lastActivity', '2 hours ago',
              'teachers', c.teachers
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

    const allTeacherIds = new Set();
    academicsData.forEach(ac => {
      ac.courses.forEach(course => {
        if (course.teachers && Array.isArray(course.teachers)) {
          course.teachers.forEach(id => allTeacherIds.add(id));
        }
      });
    });

    let facultyMap = {};
    if (allTeacherIds.size > 0) {
      const { rows: faculties } = await pool.query(
        'SELECT id, full_name FROM faculty WHERE id = ANY($1)',
        [Array.from(allTeacherIds)]
      );
      facultyMap = Object.fromEntries(faculties.map(f => [f.id, f.full_name])); 
    }

    academicsData.forEach(ac => {
      ac.courses.forEach(course => {
        if (course.teachers && course.teachers.length > 0) {
          course.faculty = course.teachers
            .map(id => facultyMap[id] || 'Unknown Faculty')
            .join(', ');
        } else {
          course.faculty = 'No faculty assigned';
        }
        delete course.teachers;
      });
    });

    res.json({ success: true, academicsData });
  } catch (error) {
    console.error('Get courses management error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch management data' });
  }
};

export const updateCourseTeachers = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { teacherIds } = req.body;

    if (!Array.isArray(teacherIds)) {
      return res.status(400).json({ success: false, error: 'teacherIds must be an array' });
    }

    const { rows } = await pool.query(
      `UPDATE courses 
       SET teachers = $1 
       WHERE id = $2 
       RETURNING id, teachers`,
      [teacherIds, courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, teachers: rows[0].teachers });
  } catch (error) {
    console.error('Update teachers error:', error);
    res.status(500).json({ success: false, error: 'Failed to update teachers' });
  }
};

export const getAcademicCourseScheduleCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const academicAdminId = req.user.id;

    const schedule = await getAcademicCourseSchedule(id, academicAdminId);
    res.json({ success: true, schedule });
  } catch (error) {
    console.error('Get academic course schedule error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
  }
};

export const saveAcademicCourseScheduleCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const academicAdminId = req.user.id;
    const { startDate, endDate, startTime, endTime, meetingLink } = req.body;

    if (meetingLink !== undefined && !startDate && !endDate && !startTime && !endTime) {
      const existingSchedule = await getAcademicCourseSchedule(id, academicAdminId);
      if (!existingSchedule) {
        return res.status(400).json({ success: false, error: 'No existing schedule found. Please set batch timings first.' });
      }

      const schedule = await updateAcademicCourseSchedule({
        courseId: id,
        academicAdminId,
        startDate: existingSchedule.start_date,
        endDate: existingSchedule.end_date,
        startTime: existingSchedule.start_time,
        endTime: existingSchedule.end_time,
        meetingLink: meetingLink || null
      });

      return res.json({ success: true, schedule });
    }

    if (!startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, error: 'Batch timings required' });
    }

    const schedule = await updateAcademicCourseSchedule({
      courseId: id,
      academicAdminId,
      startDate,
      endDate,
      startTime,
      endTime,
      meetingLink: meetingLink || null
    });

    res.json({ success: true, schedule });
  } catch (error) {
    console.error('Save academic course schedule error:', error);
    res.status(500).json({ success: false, error: 'Failed to save schedule' });
  }
};