// src/pages/auth/OTPVerification.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, CheckCircle, AlertCircle, Search, Filter, Shield } from 'lucide-react';
import apiConfig from '../../config/apiConfig';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from signup page
  const { phone, user_type, returnTo, isPhoneVerification } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Auto-start timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${apiConfig.API_BASE_URL}/api/auth/student/verify-phone/verify-otp`, {
        phone,
        otp: otpValue,
        user_type,
      });

      if (res.data.success) {
        // ✅ CORRECT: role-based key
        const key =
          user_type === 'student'
            ? 'studentPhoneVerified'
            : 'facultyPhoneVerified';

        sessionStorage.setItem(key, 'true');

        navigate(returnTo || '/signup');

      } else {
        setError(res.data.message || 'Invalid or expired OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${apiConfig.API_BASE_URL}/api/auth/student/verify-phone/resend-otp`, {
        phone,
        user_type,
      });

      if (res.data.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();
        alert('New OTP has been sent!');
      } else {
        setError(res.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Could not resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If no phone was passed → show error
  if (!phone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Phone Number Provided</h2>
          <p className="text-gray-600 mb-6">Please go back and enter your phone number first.</p>
          <Link
            to={returnTo || '/signup'}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Back to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-4">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">OTP Verification</h1>
            <p className="text-gray-500 text-sm">
              We have sent a verification code to your phone
            </p>
            <p className="text-gray-700 font-semibold">+91 {phone}</p>
          </div>

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              {!canResend ? (
                <p>Resend code in <span className="font-semibold text-blue-600">{timer}s</span></p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className={`text-blue-600 font-semibold hover:underline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.some(digit => digit === '')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>

          <div className="text-center text-xs text-gray-500">
            <p>Didn't receive the code?</p>
            <Link
              to={returnTo || '/signup'}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;