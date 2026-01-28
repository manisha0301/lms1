// utils/reminderCron.js
import cron from 'node-cron';
import pool from '../config/db.js';
import { addNotificationForFaculties, addNotificationForFaculty, addNotificationForStudent, addNotificationForStudents } from '../models/notificationModel.js';

// Main reminder check – runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const nowStr = now.toISOString();
    const oneHourLaterStr = oneHourLater.toISOString();

    console.log(`[${now.toISOString()}] Running reminder check...`);

    // 1. Faculty – Upcoming CLASSES
    const { rows: classes } = await pool.query(`
      SELECT 
        c.id AS course_id,
        c.name AS course_name,
        s.start_time,
        c.teachers,
        (CURRENT_DATE + s.start_time::time) AS class_datetime
      FROM academic_course_schedules s
      JOIN courses c ON s.course_id = c.id
      WHERE 
        CURRENT_DATE BETWEEN s.start_date AND s.end_date
        AND (CURRENT_DATE + s.start_time::time) >= NOW()
        AND (CURRENT_DATE + s.start_time::time) <= NOW() + INTERVAL '1 hour'
    `);

    for (const cls of classes) {
      const facultyIds = cls.teachers || [];
      if (facultyIds.length === 0) continue;

      const timeStr = cls.start_time.slice(0, 5);
      const message = `Your class "${cls.course_name}" starts at ${timeStr} (in ~1 hour)`;

      await addNotificationForFaculties(
        pool,
        message,
        'class',
        'high',
        facultyIds
      );
    }

    // 2. Faculty – Upcoming EXAMS
    const { rows: exams } = await pool.query(`
      SELECT 
        e.id,
        e.topic AS exam_name,
        s.start_time,
        e.faculty_id,
        (s.date + s.start_time::time) AS exam_datetime
      FROM exams e
      JOIN exam_slots s ON e.id = s.exam_id
      WHERE 
        (s.date + s.start_time::time) >= NOW()
        AND (s.date + s.start_time::time) <= NOW() + INTERVAL '1 hour'
    `);




    for (const exam of exams) {
      const facultyId = exam.faculty_id;
      if (!facultyId) continue;

      const timeStr = exam.start_time.slice(0, 5);
      const message = `Your exam "${exam.exam_name}" starts at ${timeStr} (in ~1 hour)`;

      await addNotificationForFaculty(
        pool,
        message,
        'exam',
        'high',
        facultyId
      );
    }

    // Student CLASS reminders (1 hour before)

    const { rows: studentClasses } = await pool.query(`
      SELECT DISTINCT 
        st.id AS student_id,
        c.name AS course_name,
        s.start_time,
        (CURRENT_DATE + s.start_time::time) AS class_datetime
      FROM students st
      JOIN courses c ON TRUE
      JOIN course_academic_assignments caa ON c.id = caa.course_id
      JOIN academic_course_schedules s ON c.id = s.course_id
      JOIN academic_admins aa ON caa.academic_admin_id = aa.id
      WHERE 
        LOWER(st.graduation_university) LIKE LOWER('%' || aa.academic_name || '%')
        AND CURRENT_DATE BETWEEN s.start_date AND s.end_date
        AND (CURRENT_DATE + s.start_time::time) >= NOW()
        AND (CURRENT_DATE + s.start_time::time) <= NOW() + INTERVAL '1 hour'
    `);


    for (const cls of studentClasses) {
      const message = `Live Class in 1 hour: "${cls.course_name}" at ${cls.start_time.slice(0,5)}`;
      await addNotificationForStudent(
        pool,
        message,
        'class',
        'high',
        cls.student_id
      );
    }

    // ── Student EXAM reminders (1 hour before) ─────────────────────────────────
    const { rows: studentExams } = await pool.query(`
      SELECT DISTINCT 
        st.id AS student_id,
        e.topic AS exam_name,
        sl.start_time,
        (sl.date + sl.start_time::time) AS exam_datetime
      FROM students st
      JOIN courses c ON TRUE
      JOIN course_academic_assignments caa ON c.id = caa.course_id
      JOIN exams e ON c.id = e.course_id
      JOIN exam_slots sl ON e.id = sl.exam_id
      JOIN academic_admins aa ON caa.academic_admin_id = aa.id
      WHERE 
        LOWER(st.graduation_university) LIKE LOWER('%' || aa.academic_name || '%')
        AND (sl.date + sl.start_time::time) >= NOW()
        AND (sl.date + sl.start_time::time) <= NOW() + INTERVAL '1 hour'
    `);


    for (const exam of studentExams) {
      const message = `Exam in 1 hour: "${exam.exam_name}" at ${exam.start_time.slice(0,5)}`;
      await addNotificationForStudent(
        pool,
        message,
        'exam',
        'high',
        exam.student_id
      );
    }

    console.log(`Reminder check done: ${classes.length} faculty classes + ${exams.length} faculty exams + ${studentClasses.length} student classes + ${studentExams.length} student exams`);
  } catch (err) {
    console.error('Reminder cron error:', err.stack);
  }
});

// Daily at 8:00 AM – check assignments due tomorrow
cron.schedule('0 8 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0] + ' 23:59:59';

    const { rows: dueSoon } = await pool.query(`
      SELECT DISTINCT 
        st.id AS student_id,
        a.title,
        a.due_date
      FROM students st
      JOIN courses c ON TRUE
      JOIN course_academic_assignments caa ON c.id = caa.course_id
      JOIN course_assessments a ON c.id = a.course_id
      JOIN academic_admins aa ON caa.academic_admin_id = aa.id
      WHERE LOWER(st.graduation_university) LIKE LOWER('%' || aa.academic_name || '%')
        AND a.due_date::date = CURRENT_DATE + INTERVAL '1 day'
    `);

    for (const ass of dueSoon) {
      const dueFormatted = new Date(ass.due_date).toLocaleDateString('en-IN');
      const message = `Assignment Due Tomorrow: "${ass.title}" at 11:59 PM`;
      await addNotificationForStudent(
        pool,
        message,
        'assignment',
        'high',
        ass.student_id
      );
    }

    console.log(`Daily due assignment check done: ${dueSoon.length} students notified`);
  } catch (err) {
    console.error('Daily assignment due reminder error:', err.message);
  }
});

console.log('Reminder cron job started');