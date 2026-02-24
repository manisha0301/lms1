// backend/src/controllers/verificationController.js
import {
  storeOTP,
  getOTPData,
  incrementAttempt,
  deleteOTP
} from '../models/verificationModel.js';

import {
  generateOTP,
  hashOTP,
  verifyOTP,
  sendVerificationEmail
} from '../utils/emailService.js';

export const sendEmailOTP = async (req, res) => {
  const { email, user_type } = req.body;

  if (!email || !user_type) {
    return res.status(400).json({ success: false, message: 'Email and user_type required' });
  }

  if (!['faculty', 'student'].includes(user_type)) {
    return res.status(400).json({ success: false, message: 'Invalid user_type' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);

    // Store OTP
    await storeOTP(cleanEmail, user_type, otpHash, expiresAt);

    // Send email
    const emailSent = await sendVerificationEmail(cleanEmail, otp);

    if (!emailSent) {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }

    return res.json({
      success: true,
      message: 'OTP sent successfully. Check your email.'
    });
  } catch (err) {
    console.error('sendEmailOTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyEmailOTP = async (req, res) => {
  const { email, otp, user_type } = req.body;

  if (!email || !otp || !user_type) {
    return res.status(400).json({ success: false, message: 'Email, OTP and user_type required' });
  }

  if (!['faculty', 'student'].includes(user_type)) {
    return res.status(400).json({ success: false, message: 'Invalid user_type' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // Get stored OTP
    const data = await getOTPData(cleanEmail, user_type);

    if (!data) {
      return res.status(400).json({ success: false, message: 'No OTP request found' });
    }

    // Check expiry
    if (new Date() > new Date(data.expires_at)) {
      await deleteOTP(cleanEmail, user_type);
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Check attempt limit
    if (data.attempt_count >= 5) {
      await deleteOTP(cleanEmail, user_type);
      return res.status(429).json({ success: false, message: 'Too many attempts. Request new OTP.' });
    }

    // Verify OTP — compare plain entered OTP with stored hash
    console.log('Verifying OTP - plain vs hash');
    const isValid = await verifyOTP(otp, data.otp_hash);   // ← CORRECT: plain vs hash

    if (!isValid) {
      await incrementAttempt(cleanEmail, user_type);
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Success - delete OTP row
    await deleteOTP(cleanEmail, user_type);

    return res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (err) {
    console.error('verifyEmailOTP error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};