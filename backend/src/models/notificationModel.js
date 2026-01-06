// backend/src/models/notificationModel.js
import pool from '../config/db.js';

export const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      recipient_type VARCHAR(20) NOT NULL,  -- 'superadmin', 'admin', 'academic', 'faculty', 'student'
      recipient_id INTEGER NOT NULL,        -- ID from the respective user table (e.g., super_admins.id)
      message TEXT NOT NULL,
      type VARCHAR(50),                     -- e.g., 'admin', 'success', 'revenue', 'warning'
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

// Optional: Function to add a notification (can be used in controllers for other actions)
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

export const addNotificationForSuperAdmin = async (pool, message, type = 'info', priority = 'medium') => {
  // For now we assume there's only one superadmin or we notify ALL superadmins
  // If you ever have multiple superadmins → change to loop or different logic

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