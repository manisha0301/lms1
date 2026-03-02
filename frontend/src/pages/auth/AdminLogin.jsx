// src/pages/auth/AdminLogin.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [formErrors, setFormErrors] = useState({});

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...formErrors };

    if (name === "email") {
      const trimmed = (value || "").trim().toLowerCase();
      if (!trimmed) {
        errors.email = "Email is required";
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          errors.email = "Please enter a valid email address";
        } else {
          const tld = trimmed.split('@')[1]?.split('.').pop() || '';
          if (/\d$/.test(tld)) {
            errors.email = "Invalid email domain – top-level domain cannot end with a number";
          } else {
            delete errors.email;
          }
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

    // Validate on every change
    validateField(name, value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Final validation pass
    validateField("email", formData.email);
    validateField("password", formData.password);

    if (Object.keys(formErrors).length > 0) {
      alert("Please fix the validation errors before logging in");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login successful:", data);
        navigate("/dash"); // or /academic-dashboard if separate
      } else {
        alert("Login failed: " + (data.error || "Invalid credentials"));
      }
    } catch (error) {
      alert("Login error. Check server connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && Object.keys(formErrors).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Branding (unchanged) */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tighter mb-10">Kristellar Aerospace</div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Admin <span className="text-green-400">Portal</span>
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Manage organizations, courses, faculty, and the entire LMS ecosystem.
            </p>
            <div className="space-y-3 text-lg opacity-80">
              <p>Kristellar Aerospace Solutions Pvt. Ltd.</p>
            </div>
          </div>
          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">© 2025 Kristellar Aerospace Solutions Pvt. Ltd. All Rights Reserved.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Admin Login Form with Validation */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
              <p className="mt-3 text-gray-600">Restricted access for Kristellar Aerospace management only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@kristellar.com"
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
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
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
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
                {loading ? "Logging in..." : "Login as Admin"}
              </button>
            </form>

            <div className="mt-10 text-center">
              {/* You can add "Forgot Password?" link here later if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;