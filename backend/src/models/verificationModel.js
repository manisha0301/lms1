// backend/src/models/verificationModel.js
import pool from '../config/db.js';

export const createEmailVerificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS email_verifications (
      id              BIGSERIAL PRIMARY KEY,
      email           TEXT NOT NULL,
      user_type       TEXT NOT NULL,               -- 'faculty', 'student', etc.
      otp_hash        TEXT NOT NULL,
      expires_at      TIMESTAMPTZ NOT NULL,
      attempt_count   SMALLINT DEFAULT 0,
      created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT unique_email_type UNIQUE (email, user_type)
    );

    CREATE INDEX IF NOT EXISTS idx_email_verif_email_type_expiry 
      ON email_verifications (email, user_type, expires_at);
  `;

  try {
    await pool.query(query);
    console.log('email_verifications table created or already exists');
  } catch (err) {
    console.error('Failed to create email_verifications table:', err.message);
    throw err;
  }
};

// Store or update OTP (insert or replace if exists)
export const storeOTP = async (email, userType, otpHash, expiresAt) => {
  const sql = `
    INSERT INTO email_verifications 
      (email, user_type, otp_hash, expires_at, attempt_count)
    VALUES ($1, $2, $3, $4, 0)
    ON CONFLICT (email, user_type) 
    DO UPDATE SET
      otp_hash       = EXCLUDED.otp_hash,
      expires_at     = EXCLUDED.expires_at,
      attempt_count  = 0,
      created_at     = CURRENT_TIMESTAMP
    RETURNING id;
  `;

  const { rowCount } = await pool.query(sql, [
    email.toLowerCase().trim(),
    userType,
    otpHash,
    expiresAt
  ]);

  return rowCount > 0;
};

// Get current OTP data for verification
export const getOTPData = async (email, userType) => {
  const sql = `
    SELECT 
      otp_hash,
      expires_at,
      attempt_count
    FROM email_verifications
    WHERE email = $1 AND user_type = $2
    LIMIT 1;
  `;

  const { rows } = await pool.query(sql, [
    email.toLowerCase().trim(),
    userType
  ]);

  return rows[0] || null;
};

// Increment failed attempt count
export const incrementAttempt = async (email, userType) => {
  await pool.query(`
    UPDATE email_verifications
    SET attempt_count = attempt_count + 1
    WHERE email = $1 AND user_type = $2
  `, [email.toLowerCase().trim(), userType]);
};

// Delete OTP row after successful verification or expiry
export const deleteOTP = async (email, userType) => {
  await pool.query(`
    DELETE FROM email_verifications
    WHERE email = $1 AND user_type = $2
  `, [email.toLowerCase().trim(), userType]);
};