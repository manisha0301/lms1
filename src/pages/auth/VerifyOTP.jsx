import { useState, useRef, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import { BookOpen, Clock, CheckCircle, AlertCircle, Search, Filter, Shield } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

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

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      alert(`Verifying OTP: ${otpValue}`);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0].focus();
    }
  };

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
              We have sent a verification code to
            </p>
            <p className="text-gray-700 font-semibold">+91 *****12345</p>
          </div>

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
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              {!canResend ? (
                <p>Resend code in <span className="font-semibold text-blue-600">{timer}s</span></p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={otp.some(digit => digit === '')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            Verify & Proceed
          </button>

          <div className="text-center text-xs text-gray-500">
            <p>Didn't receive the code?</p>
             <Link to="/verify-email-otp" className="text-sm text-blue-600 hover:underline">
              Try another method
            </Link>
            {/* <button className="text-blue-600 hover:underline font-medium mt-1">
              Try another method
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default OTPVerification;






