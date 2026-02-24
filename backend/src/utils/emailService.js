// backend/src/utils/emailService.js
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Send verification email
export const sendVerificationEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Cybernetics LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email - Cybernetics LMS',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
        <h2 style="color: #4f46e5;">Email Verification</h2>
        <p>Hello,</p>
        <p>Use this OTP to verify your email:</p>
        <h1 style="letter-spacing: 10px; color: #4f46e5; font-size: 36px;">${otp}</h1>
        <p>This OTP expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>Cybernetics LMS Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] OTP sent to ${to}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Send failed:', error.message);
    return false;
  }
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return otpGenerator.generate(Number(process.env.OTP_DIGITS || 6), {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
};

// Hash OTP for storage
export const hashOTP = async (otp) => {
  return bcrypt.hash(otp, 10);
};

// Verify entered OTP against stored hash
export const verifyOTP = async (enteredOtp, storedHash) => {
  return bcrypt.compare(enteredOtp, storedHash);
};