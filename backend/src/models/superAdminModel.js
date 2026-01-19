// src/models/superAdminModel.js
import bcrypt from 'bcrypt';

export const createSuperAdminTable = async (pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS super_admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('super_admins table created');
};

export const findSuperAdminByEmail = async (pool, email) => {
  const { rows } = await pool.query(
    `SELECT id, email, phone, password_hash, created_at FROM super_admins WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
};

// New function: Create default super admin if not exists
export const createDefaultSuperAdmin = async (pool) => {
  const defaultEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
  const defaultPlainPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!defaultPlainPassword) {
    console.warn('SUPER_ADMIN_PASSWORD not set in .env – skipping default super admin creation');
    return;
  }

  const existing = await findSuperAdminByEmail(pool, defaultEmail);
  if (existing) {
    console.log(`Super admin with email ${defaultEmail} already exists`);
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(defaultPlainPassword, 10);
    await pool.query(
      `INSERT INTO super_admins (email, password_hash) VALUES ($1, $2)`,
      [defaultEmail, passwordHash]
    );
    console.log(`Default super admin created: ${defaultEmail}`);
    console.log('IMPORTANT: Change the password immediately after first login!');
  } catch (error) {
    console.error('Failed to create default super admin:', error);
  }
};

export const updateSuperAdminPassword = async (pool, id, newPasswordHash) => {
  const { rows } = await pool.query(
    `UPDATE super_admins SET password_hash = $1 WHERE id = $2 RETURNING id, email`,
    [newPasswordHash, id]
  );
  return rows[0] || null;
};