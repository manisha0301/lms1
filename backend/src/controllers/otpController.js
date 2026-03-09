// backend/src/controllers/otpController.js
import axios from 'axios';
import * as otpModel from '../models/otpModel.js'; // Import all functions from otpModel
import 'dotenv/config'; // Loads .env variables
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const COUNTRY_CODE = '91';
console.log("MSG91 Auth Key:", MSG91_AUTH_KEY);
console.log("MSG91 Template ID:", MSG91_TEMPLATE_ID);
console.log("MSG91 Sender ID:", MSG91_SENDER_ID);


export const sendOTP = async (req, res) => {
  const { phone, user_type } = req.body; // Added user_type support

  if (!phone || !user_type || !['student', 'faculty', 'admin', 'superadmin'].includes(user_type)) {
    return res.status(400).json({ success: false, message: 'Phone and valid user_type (student/faculty/admin/superadmin) required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await otpModel.saveOtp(phone, otp, user_type); // Pass user_type if your model supports it

    console.log(`Generated OTP for ${phone}: ${otp}`);
    const response = await axios.post('https://api.msg91.com/api/v5/otp', {
      template_id: MSG91_TEMPLATE_ID,
      mobile: COUNTRY_CODE + phone,
      otp,
      sender: MSG91_SENDER_ID
    }, {
      headers: {
        'authkey': MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      }
    });

    console.log("MSG91 OTP response:", response.data);

    if(response.status !== 200) {
      console.error("MSG91 OTP send failed:", response.data);
      return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }

    const data = response.data;
    if (data && data.type === "success") {
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send OTP', details: data });
    }
  } catch (error) {
    console.error("MSG91 OTP error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyOTP = async (req, res) => {
  const { phone, otp, user_type } = req.body;

  if (!phone || !otp || !user_type || !['student', 'faculty', 'admin', 'superadmin'].includes(user_type)) {
    return res.status(400).json({ success: false, message: 'Phone, OTP and valid user_type required' });
  }

  try {
    const record = await otpModel.verifyOtp(phone, otp);

    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Cleanup OTP record
    await otpModel.deleteOtp(phone);

    // ── Special handling for superadmin ─────────────────────────────────────
    if (user_type === 'superadmin') {
      // Fetch superadmin details using phone (since OTP was stored against phone)
      const { rows } = await pool.query(
        `SELECT id, email, full_name, phone 
         FROM super_admins 
         WHERE phone = $1`,
        [phone]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Superadmin account not found'
        });
      }

      const superAdmin = rows[0];

      // Generate JWT token
      const token = jwt.sign(
        {
          id: superAdmin.id,
          role: "superadmin",
          email: superAdmin.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
      );

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully - Superadmin logged in',
        token,
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          full_name: superAdmin.full_name || 'Super Admin',
          phone: superAdmin.phone,
          role: "superadmin"
        }
      });
    }

    // For other user types (student, faculty, admin) — no token needed here
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const resendOTP = async (req, res) => {
  const { phone, user_type } = req.body;

  if (!phone || !user_type || !['student', 'faculty', 'admin', 'superadmin'].includes(user_type)) {
    return res.status(400).json({ success: false, message: 'Phone and valid user_type required' });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Update the OTP in the database for the same phone number
    const updateResult = await otpModel.updateOtp(phone, newOtp);

    if (!updateResult) {
      return res.status(400).json({ success: false, message: 'Phone number not found or failed to update OTP' });
    }

    // Send the new OTP using MSG91
    const response = await axios.post('https://api.msg91.com/api/v5/otp', {
      template_id: MSG91_TEMPLATE_ID,
      mobile: COUNTRY_CODE + phone,
      otp: newOtp,
      sender: MSG91_SENDER_ID
    }, {
      headers: {
        'authkey': MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;
    if (data && data.type === "success") {
      return res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to resend OTP', details: data });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};