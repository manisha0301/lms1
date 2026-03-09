// src/pages/auth/SuperAdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, RefreshCw, X } from "lucide-react";
import axios from "axios";

const SuperAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/superadmin/login/send-otp",
        formData
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
        alert(response.data.message || "Error sending OTP");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed. Please try again.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/superadmin/login/verify-otp",
        {
          phone: otpSentTo.realPhone,
          otp,
          user_type: "superadmin",
        }
      );

      if (response.data.success) {
        localStorage.setItem("superAdminToken", response.data.token);
        localStorage.setItem("superAdminUser", JSON.stringify(response.data.user));

        navigate("/dash"); // ← your dashboard route
      } else {
        setOtpError(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/superadmin/login/send-otp",
        {
          email: otpSentTo.realEmail,
          // password is NOT sent again on resend
        }
      );

      if (response.data.success) {
        alert("OTP resent successfully. Check your email and phone.");
      } else {
        setOtpError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Branding (Matching LMS Design) */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tighter mb-10">Kristellar Cyberspace</div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Super Admin <span className="text-green-400">Portal</span>
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Manage organizations, courses, faculty, and the entire LMS ecosystem.
            </p>
            <div className="space-y-3 text-lg opacity-80">
              <p>Kristellar Cyberspace Solutions Pvt. Ltd.</p>
            </div>
          </div>
          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">© 2026 Kristellar Cyberspace Solutions Pvt. Ltd. All Rights Reserved.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Super Admin Login Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Super Admin Login</h2>
              <p className="mt-3 text-gray-600">Restricted access for Kristellar Cyberspace management only</p>
            </div>

            {!showOtpModal ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Login as Super Admin"}
                </button>
              </form>
            ) : (
              // OTP Verification Modal
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
                      className="text-[#1e3a8a] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                      <RefreshCw className={`w-5 h-5 ${resendLoading ? "animate-spin" : ""}`} />
                      {resendLoading ? "Resending..." : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;