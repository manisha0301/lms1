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


export const createRevenueTable = async (pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS revenue (
      id                  BIGSERIAL PRIMARY KEY,

      academic_id         INTEGER         NOT NULL,
      student_id          INTEGER         NOT NULL,
      graduation_university VARCHAR(255)  NOT NULL,

      course_id           INTEGER         NOT NULL,
      course_price        NUMERIC(12,2)   NOT NULL,

      paid_amount         NUMERIC(12,2)   NOT NULL,

      payment_timestamp   TIMESTAMP       NOT NULL,   -- contains date + time → month/year/time can be extracted
      payment_status      VARCHAR(50)     NOT NULL,

      created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

      -- Foreign keys (recommended to prevent bad data)
      CONSTRAINT fk_revenue_academic 
        FOREIGN KEY (academic_id) 
        REFERENCES academic_admins(id) ON DELETE RESTRICT,

      CONSTRAINT fk_revenue_student 
        FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE RESTRICT,

      CONSTRAINT fk_revenue_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE RESTRICT
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_revenue_academic_timestamp 
      ON revenue (academic_id, payment_timestamp);

    CREATE INDEX IF NOT EXISTS idx_revenue_timestamp_desc 
      ON revenue (payment_timestamp DESC);

    CREATE INDEX IF NOT EXISTS idx_revenue_course 
      ON revenue (course_id);
  `;

  try {
    await pool.query(query);
    console.log('revenue table created or already exists');
  } catch (err) {
    console.error('Failed to create revenue table:', err.message);
    throw err;
  }
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
  const defaultPhone = process.env.SUPER_ADMIN_PHONE || '9999999999';

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
      `INSERT INTO super_admins (email, password_hash, phone) VALUES ($1, $2, $3)`,
      [defaultEmail, passwordHash, defaultPhone]
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


// NEW: Get total platform revenue + this month + % change
export const getPlatformRevenueStats = async (pool) => {
  try {
    // Only 'Completed' should count as full successful revenue
    const successStatuses = ['Completed'];  // ← change here

    // 1. Total all-time revenue (only Completed)
    const totalRes = await pool.query(`
      SELECT COALESCE(SUM(paid_amount), 0) AS total_revenue
      FROM revenue
      WHERE payment_status = ANY($1)
    `, [successStatuses]);
    const totalRevenue = parseFloat(totalRes.rows[0].total_revenue || 0);

    // 2. Current month (March 2026) - only Completed
    const currentMonthRes = await pool.query(`
      SELECT COALESCE(SUM(paid_amount), 0) AS current_month_revenue
      FROM revenue
      WHERE DATE_TRUNC('month', payment_timestamp) = DATE_TRUNC('month', CURRENT_DATE)
        AND payment_status = ANY($1)
    `, [successStatuses]);
    const currentMonthRevenue = parseFloat(currentMonthRes.rows[0].current_month_revenue || 0);

    // 3. Previous month (Feb 2026) - only Completed
    const prevMonthRes = await pool.query(`
      SELECT COALESCE(SUM(paid_amount), 0) AS prev_month_revenue
      FROM revenue
      WHERE DATE_TRUNC('month', payment_timestamp) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        AND payment_status = ANY($1)
    `, [successStatuses]);
    const prevMonthRevenue = parseFloat(prevMonthRes.rows[0].prev_month_revenue || 0);

    // Percentage change
    let percentageChange = 0;
    if (prevMonthRevenue > 0) {
      percentageChange = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      percentageChange = 100;
    }

    return {
      totalRevenue,
      currentMonthRevenue,
      percentageChange: percentageChange.toFixed(1),
      formattedTotal: formatIndianCurrency(totalRevenue),
      formattedThisMonth: formatIndianCurrency(currentMonthRevenue),
      changeSign: currentMonthRevenue >= prevMonthRevenue ? '+' : ''
    };
  } catch (error) {
    console.error('Error calculating revenue stats:', error);
    throw error;
  }
};

// Helper to format numbers like 28.5L, 3.2L, etc.
function formatIndianCurrency(value) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(2)}K`;
  }
  return `₹${value.toFixed(0)}`;
}