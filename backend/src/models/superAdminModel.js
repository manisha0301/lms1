// src/models/superAdminModel.js
export const createSuperAdminTable = async (pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS super_admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('super_admins table created');
};

export const findSuperAdminByEmail = async (pool, email) => {
  const { rows } = await pool.query(
    `SELECT * FROM super_admins WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
};
