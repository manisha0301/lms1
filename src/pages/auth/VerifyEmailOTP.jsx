// src/pages/auth/VerifyEmailOTP.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

export default function VerifyEmailOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !isVerified) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, isVerified]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      setTimeout(() => {
        setIsVerified(true);
      }, 800);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setIsVerified(false);
      inputRefs.current[0]?.focus();
      alert('New OTP sent to your email!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
          
          {/* Back Button */}
          <Link 
            to="/signup" 
            className="flex items-center gap-2 text-[#1e3a8a] text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1e3a8a] rounded-full shadow-xl mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Verify Your Email</h1>
            <p className="text-gray-600 max-w-xs mx-auto">
              We've sent a 6-digit verification code to
            </p>
            <div className="mt-3 px-4 py-2 bg-indigo-50 rounded-lg inline-block">
              <p className="font-semibold text-[#1e3a8a]">sarah.chen@cybernetics.edu</p>
            </div>
          </div>

          {/* Success State */}
          {isVerified ? (
            <div className="text-center py-10 animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Email Verified!</h2>
              <p className="text-gray-600 mb-8">You can now reset your password.</p>
              <Link
                to="/reset-password"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Continue to Reset Password
              </Link>
            </div>
          ) : (
            <>
              {/* OTP Inputs */}
              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-2xl focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-sm"
                    placeholder="0"
                  />
                ))}
              </div>

              {/* Timer / Resend */}
              <div className="text-center mb-8">
                {!canResend ? (
                  <p className="text-gray-600">
                    Resend code in{' '}
                    <span className="font-bold text-indigo-600 text-lg">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-[#1e3a8a] font-semibold hover:underline text-lg"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={() => {
                  if (otp.every(d => d !== '')) {
                    setIsVerified(true);
                  }
                }}
                disabled={otp.some(d => d === '')}
                className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
              >
                Verify Email
              </button>
            </>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Didn't receive the email?</p>
            <p className="mt-1">
              Check your <span className="font-medium text-[#1e3a8a]">Spam</span> or{' '}
              <span className="font-medium text-[#1e3a8a]">Promotions</span> folder
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          © 2025 Cybernetics LMS • Secure Authentication
        </p>
      </div>
    </div>
  );
}