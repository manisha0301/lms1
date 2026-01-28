// backend/src/models/notificationModel.js
import pool from '../config/db.js';

export const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      recipient_type VARCHAR(20) NOT NULL,  -- 'superadmin', 'admin', 'academicadmin', 'faculty', 'student'
      recipient_id INTEGER NOT NULL,        -- ID from the respective user table
      message TEXT NOT NULL,
      type VARCHAR(50),                     -- e.g., 'course', 'student', 'faculty', 'alert', 'success'
      priority VARCHAR(20) DEFAULT 'medium',-- 'high', 'medium', 'low'
      status VARCHAR(20) DEFAULT 'unread',  -- 'unread', 'read'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_notifications_recipient 
      ON notifications (recipient_type, recipient_id, created_at DESC);
  `;
  await pool.query(query);
  console.log('notifications table created or already exists');
};

export const getNotificationsByUser = async (recipientType, recipientId, limit = null) => {
  let query = `
    SELECT 
      id, 
      message, 
      type, 
      priority, 
      status, 
      created_at::text AS created_at  -- Send as ISO string for frontend
    FROM notifications 
    WHERE recipient_type = $1 AND recipient_id = $2 
    ORDER BY created_at DESC
  `;
  const values = [recipientType, recipientId];

  if (limit) {
    query += ' LIMIT $3';
    values.push(limit);
  }

  const { rows } = await pool.query(query, values);
  return rows;
};

// General function to add a single notification
export const addNotification = async ({
  recipientType,
  recipientId,
  message,
  type,
  priority = 'medium',
  status = 'unread'
}) => {
  const { rows } = await pool.query(
    `INSERT INTO notifications (recipient_type, recipient_id, message, type, priority, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [recipientType, recipientId, message, type, priority, status]
  );
  return rows[0];
};

// Notify all superadmins (works for one or multiple superadmins)
export const addNotificationForSuperAdmin = async (pool, message, type = 'info', priority = 'medium') => {
  const { rows: superAdmins } = await pool.query(
    `SELECT id FROM super_admins`
  );

  if (superAdmins.length === 0) return;

  const values = superAdmins.map(sa => [
    'superadmin',
    sa.id,
    message,
    type,
    priority,
    'unread'
  ]);

  const placeholders = values.map((_, i) => `($${i*6+1}, $${i*6+2}, $${i*6+3}, $${i*6+4}, $${i*6+5}, $${i*6+6})`).join(',');

  await pool.query(`
    INSERT INTO notifications 
      (recipient_type, recipient_id, message, type, priority, status)
    VALUES ${placeholders}
  `, values.flat());
};

// Notify specific list of academic admins (used for assignments or broadcast)
export const addNotificationForAcademicAdmins = async (pool, message, type = 'info', priority = 'medium', academicAdminIds = []) => {
  if (!Array.isArray(academicAdminIds) || academicAdminIds.length === 0) {
    return; // no one to notify
  }

  const values = academicAdminIds.map(id => [
    'academicadmin',
    id,
    message,
    type,
    priority,
    'unread'
  ]);

  const placeholders = values.map((_, i) => `($${i*6+1}, $${i*6+2}, $${i*6+3}, $${i*6+4}, $${i*6+5}, $${i*6+6})`).join(',');

  await pool.query(`
    INSERT INTO notifications 
      (recipient_type, recipient_id, message, type, priority, status)
    VALUES ${placeholders}
  `, values.flat());
};

// Optional helper: Get IDs of all active academic admins (useful for broadcast)
export const getAllActiveAcademicAdminIds = async (customPool) => {
  const db = customPool || pool;
  const { rows } = await db.query(
    "SELECT id FROM academic_admins WHERE status = 'Active'"
  );
  return rows.map(r => r.id);
};



export const addNotificationForFaculty = async (
  pool,
  message,
  type = 'info',
  priority = 'medium',
  facultyId
) => {
  if (!facultyId) return;

  try {
    await pool.query(
      `INSERT INTO notifications 
        (recipient_type, recipient_id, message, type, priority, status)
       VALUES ('faculty', $1, $2, $3, $4, 'unread')`,
      [facultyId, message.trim(), type, priority]
    );
    console.log(`Notification sent to faculty ${facultyId}: ${message}`);
  } catch (err) {
    console.error('Faculty notification failed:', err.message);
  }
};

export const addNotificationForFaculties = async (
  pool,
  message,
  type = 'info',
  priority = 'medium',
  facultyIds = []
) => {
  if (!Array.isArray(facultyIds) || facultyIds.length === 0) return;

  const values = facultyIds.map(id => [
    'faculty',
    Number(id),
    message.trim(),
    type,
    priority,
    'unread'
  ]);

  const placeholders = values.map((_, i) => `($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`).join(',');

  try {
    await pool.query(`
      INSERT INTO notifications 
        (recipient_type, recipient_id, message, type, priority, status)
      VALUES ${placeholders}
    `, values.flat());
    console.log(`Sent notification to ${facultyIds.length} faculty`);
  } catch (err) {
    console.error('Bulk faculty notification failed:', err.message);
  }
};

// Add these two at the bottom

export const addNotificationForStudent = async (
  pool,
  message,
  type = 'info',
  priority = 'medium',
  studentId
) => {
  if (!studentId) return;

  try {
    await pool.query(
      `INSERT INTO notifications 
        (recipient_type, recipient_id, message, type, priority, status)
       VALUES ('student', $1, $2, $3, $4, 'unread')`,
      [studentId, message.trim(), type, priority]
    );
    console.log(`Notification sent to student ${studentId}: ${message}`);
  } catch (err) {
    console.error('Student notification failed:', err.message);
  }
};

export const addNotificationForStudents = async (
  pool,
  message,
  type = 'info',
  priority = 'medium',
  studentIds = []
) => {
  if (!Array.isArray(studentIds) || studentIds.length === 0) return;

  const values = studentIds.map(id => [
    'student',
    Number(id),
    message.trim(),
    type,
    priority,
    'unread'
  ]);

  const placeholders = values.map((_, i) => `($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`).join(',');

  try {
    await pool.query(`
      INSERT INTO notifications 
        (recipient_type, recipient_id, message, type, priority, status)
      VALUES ${placeholders}
    `, values.flat());
    console.log(`Sent notification to ${studentIds.length} students`);
  } catch (err) {
    console.error('Bulk student notification failed:', err.message);
  }
};