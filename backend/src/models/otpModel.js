// backend/src/models/otpModel.js
import pool from '../config/db.js';

// Auto-create OTP table if it doesn't exist
const createOtpTable = async () => {
  try {
    // 1️⃣ Create table if not exists
    const createQuery = `
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        user_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createQuery);

    // 2️⃣ Ensure OTP column supports 6 digits
    const alterQuery = `
      ALTER TABLE otps
      ALTER COLUMN otp TYPE VARCHAR(6);
    `;

    await pool.query(alterQuery);

    console.log("✅ OTP table ready with 6-digit support");

  } catch (error) {
    console.error("❌ Error creating/updating OTP table:", error);
  }
};

// Call immediately when the module loads
createOtpTable();

// OTP Functions
export const saveOtp = async (phone, otp, user_type) => {
  const query = 'INSERT INTO otps (phone, otp, user_type) VALUES ($1, $2, $3)';
  console.log(`Saving OTP for ${phone} with user type ${user_type}`);
  await pool.query(query, [phone, otp, user_type]);
  console.log(`OTP saved for ${phone}`);
  return true;
};

export const verifyOtp = async (phone, otp) => {
  const query = `
    SELECT * FROM otps 
    WHERE phone = $1 AND otp = $2 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  const result = await pool.query(query, [phone, otp]);
  return result.rows[0];
};

export const deleteOtp = async (phone) => {
  const query = 'DELETE FROM otps WHERE phone = $1';
  await pool.query(query, [phone]);
};

export const updateOtp = async (phone, newOtp) => {
  try {
    const query = `
      UPDATE otps 
      SET otp = $1, created_at = CURRENT_TIMESTAMP 
      WHERE phone = $2
    `;
    const result = await pool.query(query, [newOtp, phone]);

    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating OTP:", error);
    return false;
  }
};