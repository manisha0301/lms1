// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, RefreshCw, X } from "lucide-react";
import axios from "axios";
import apiConfig from "../../config/apiConfig.js"; // Assuming same as faculty

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // OTP modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSentTo, setOtpSentTo] = useState({
    maskedEmail: "",
    maskedPhone: "",
    realEmail: "",
    realPhone: "",
  });
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  // NEW: Flag for successful login → triggers navigation
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Server-side error
  const [error, setError] = useState("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Real-time validation (kept exactly as yours)
  const validateField = (name, value) => {
    const errors = { ...formErrors };

    if (name === "identifier") {
      const trimmed = (value || "").trim();

      if (!trimmed) {
        errors.identifier = "Email or phone number is required";
      } else if (trimmed.includes("@")) {
        // Validate as email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed.toLowerCase())) {
          errors.identifier = "Please enter a valid email address";
        } else {
          const tld = trimmed.split('@')[1]?.split('.').pop() || '';
          if (/\d$/.test(tld)) {
            errors.identifier = "Invalid email domain – top-level domain cannot end with a number";
          } else {
            delete errors.identifier;
          }
        }
      } else {
        // Validate as phone
        const cleaned = trimmed.replace(/[\s\-+]/g, '');
        const phoneRegex = /^[6789]\d{9}$/;
        if (cleaned.length !== 10 || !phoneRegex.test(cleaned)) {
          errors.identifier = "Please enter a valid 10-digit Indian mobile number (starts with 6-9)";
        } else {
          delete errors.identifier;
        }
      }
    }

    if (name === "password") {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 8 || value.length > 16) {
        errors.password = "Password must be between 8 and 16 characters long";
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
        if (!passwordRegex.test(value)) {
          errors.password = "Password must contain uppercase, lowercase, number & special character";
        } else {
          delete errors.password;
        }
      }
    }

    setFormErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    validateField("identifier", formData.identifier);
    validateField("password", formData.password);

    if (Object.keys(formErrors).length > 0) {
      alert("Please fix the validation errors before logging in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Determine if identifier is email or phone
      const isEmail = formData.identifier.includes("@");
      const payload = {
        password: formData.password,
      };
      if (isEmail) {
        payload.email = formData.identifier.trim().toLowerCase();
      } else {
        payload.mobileNumber = formData.identifier.trim();
      }

      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/login/send-otp`,
        payload
      );

      if (response.data.success) {
        setOtpSentTo({
          maskedEmail: response.data.maskedEmail,
          maskedPhone: response.data.maskedPhone,
          realEmail: response.data.realEmail,
          realPhone: response.data.realPhone,
        });
        setShowOtpModal(true);
      } else {
        setError(response.data.message || "Error sending OTP");
      }
    } catch (err) {
      let message = err.response?.data?.message || "Login failed. Please try again.";

      if (message.includes("pending approval")) {
        message = "Your account is pending approval.";
      } else if (message.includes("Invalid credentials")) {
        message = "Incorrect email/phone or password.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");

    try {
      // Step 1: Verify OTP
      const verifyResponse = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/login/verify-otp`,
        {
          phone: otpSentTo.realPhone,
          otp,
          user_type: "student",
        }
      );

      if (!verifyResponse.data.success) {
        setOtpError(verifyResponse.data.message || "Invalid or expired OTP");
        return;
      }

      // Step 2: Finalize login (get token)
      const finalizeResponse = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/login/finalize`,
        {
          email: otpSentTo.realEmail,
        }
      );

      if (finalizeResponse.data.success) {
        localStorage.setItem("token", finalizeResponse.data.token);
        localStorage.setItem("user", JSON.stringify(finalizeResponse.data.user));
        localStorage.setItem("role", "student");

        console.log("Student login successful - Token saved:", finalizeResponse.data.token.substring(0, 10) + "...");

        setShowOtpModal(false);
        setLoginSuccess(true); // Trigger navigation via useEffect
      } else {
        setOtpError(finalizeResponse.data.message || "Login failed");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Verification / login failed");
      console.error("Student OTP verification error:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  // Reliable navigation after successful login
  useEffect(() => {
    if (loginSuccess) {
      console.log("Navigating to /dash after student OTP success");
      // Small delay to ensure localStorage is readable & any auth checks complete
      setTimeout(() => {
        navigate("/dash", { replace: true });
      }, 300);
    }
  }, [loginSuccess, navigate]);

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/login/send-otp`,
        {
          email: otpSentTo.realEmail,
        }
      );

      if (response.data.success) {
        alert("OTP resent successfully. Check your email and phone.");
      } else {
        setOtpError(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const isFormValid = formData.identifier && formData.password && Object.keys(formErrors).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Motivational & Branding */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="text-4xl font-black tracking-tighter">CodeKart</div>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome Back to <span className="text-green-400">CodeKart</span>
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Continue your journey to a 6-figure tech career with live classes, projects & placements.
            </p>
          </div>
          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">© 2025 CodeKart Solutions Pvt. Ltd.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="mt-3 text-gray-600">Login to continue learning</p>
            </div>

            {/* Social Login Buttons */}
            {/* <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 bg-[#1e40af] text-white py-4 rounded-xl font-medium hover:bg-[#1e3a8a] transition">
                <Mail className="w-5 h-5" /> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-[#1e40af] transition">
                <Phone className="w-5 h-5" /> Continue with Phone
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div> */}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}

            {!showOtpModal ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email or Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {formData.identifier.includes("@") ? (
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    )}
                    <input
                      type="text"
                      name="identifier"
                      required
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="you@example.com or 9876543210"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] outline-none transition ${
                        formErrors.identifier ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.identifier && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.identifier}</p>
                  )}
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] outline-none transition ${
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-5 rounded-xl font-bold text-lg transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${
                    isFormValid
                      ? "bg-gradient-to-r from-[#1e40af] to-green-600 text-white hover:shadow-xl"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  {loading ? "Logging in..." : "Login to Dashboard"}
                </button>
              </form>
            ) : (
              // OTP Modal - Identical to FacultyLogin
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative">
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>

                  <div className="text-center mb-6">
                    <ShieldCheck className="mx-auto text-[#1e3a8a] mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-gray-900">Verify Your Identity</h3>
                    <p className="text-gray-600 mt-2">
                      We sent a 6-digit OTP to your registered email and phone number.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <p className="text-sm text-gray-700">
                      <strong>Email:</strong> {otpSentTo.maskedEmail}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Phone:</strong> {otpSentTo.maskedPhone}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        placeholder="123456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                        required
                      />
                    </div>

                    {otpError && <p className="text-red-600 text-sm mb-4 text-center">{otpError}</p>}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowOtpModal(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="flex-1 bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition disabled:opacity-70"
                      >
                        {otpLoading ? "Verifying..." : "Verify & Login"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-[#1e40af] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                      <RefreshCw className={`w-5 h-5 ${resendLoading ? "animate-spin" : ""}`} />
                      {resendLoading ? "Resending..." : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")} className="text-[#1e40af] font-bold hover:underline cursor-pointer">
                  Sign Up Free
                </button>
              </p>
            </div>

            <p className="text-center text-xs text-gray-500 mt-10">
              By signing in, you agree to receive course updates via WhatsApp & Email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;