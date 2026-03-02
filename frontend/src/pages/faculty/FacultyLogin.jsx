// frontend/src/pages/auth/FacultyLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, Check, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import apiConfig from "../../config/apiConfig.js";

const FacultyLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({}); // NEW: validation errors
  const [showPassword, setShowPassword] = useState(false);

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

    // Validate on change
    validateField(name, value);

    // Clear server error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation pass
    validateField("email", formData.email);
    validateField("password", formData.password);

    if (Object.keys(formErrors).length > 0) {
      setError("Please fix the validation errors before logging in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiConfig.API_BASE_URL}/api/faculty/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        // Save token and faculty info in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("faculty", JSON.stringify(response.data.faculty));

        // Redirect to faculty dashboard
        navigate("/home", { replace: true });
      }
    } catch (err) {
      let message = "Login failed. Please try again.";

      if (err.response?.data?.error) {
        message = err.response.data.error;
      }

      // Friendly messages for common cases
      if (message.includes("pending approval")) {
        message = "Your account is pending approval by the Academic Admin.";
      } else if (message.includes("not approved")) {
        message = "Your account was rejected. Please contact admin.";
      } else if (message.includes("Invalid credentials")) {
        message = "Incorrect email or password.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && Object.keys(formErrors).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="text-4xl font-black tracking-tighter">CodeKart</div>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your Journey to a <span className="text-green-400">6-Figure Tech Career</span> Starts Here
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Join 50,000+ students learning from India's top mentors with live classes, real projects & 100% placement support.
            </p>

            <div className="space-y-5 text-lg">
              {[
                "Live Interactive Classes Daily",
                "1:1 Mentorship from Industry Experts",
                "100+ Hiring Partners",
                "Lifetime Access + Certificate",
                "Money-Back Guarantee"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Check className="w-7 h-7 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-4xl font-bold">50K+</div>
                <div className="text-sm opacity-80">Students Enrolled</div>
              </div>
              <div>
                <div className="text-4xl font-bold">4.9</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold">₹12 LPA</div>
                <div className="text-sm opacity-80">Avg Placement</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">
              © 2025 CodeKart Solutions Pvt. Ltd. • CIN: U72900OR2021PTC036225
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back!
              </h2>
              <p className="mt-3 text-gray-600">
                Login to continue learning
              </p>
            </div>

            {/* Social buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 bg-[#1e40af] text-white py-4 rounded-xl font-medium hover:bg-[#1e3a8a] transition">
                <Mail className="w-5 h-5" />
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-[#1e40af] transition">
                <Phone className="w-5 h-5" />
                Continue with Phone
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div>

            {/* Error Message (server or validation) */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Login Form with Validation */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] outline-none transition ${
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] outline-none transition ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

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

            <div className="mt-10 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#1e40af] font-bold hover:underline">
                  Sign Up Free
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-gray-500 mt-10">
              By signing up, you agree to receive course updates via WhatsApp & Email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;