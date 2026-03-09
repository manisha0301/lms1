// src/pages/auth/Signup.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  School,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import apiConfig from "../../config/apiConfig";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  // Phone verification states
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // Validation error states
  const [formErrors, setFormErrors] = useState({});

  // Duplicate email error (shown above email field)
  const [duplicateEmailError, setDuplicateEmailError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    graduationUniversity: "",
    agreeTerms: false,
  });

  // Real institutes from SuperAdmin
  const [institutes, setInstitutes] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [instituteLoading, setInstituteLoading] = useState(true);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/institutes`
        );
        if (res.data.success) {
          const instituteList = res.data.institutes;
          setInstitutes(instituteList);
          setFilteredInstitutes(instituteList);
        }
      } catch (err) {
        console.error("Failed to fetch institutes:", err);
        setInstitutes([]);
        setFilteredInstitutes([]);
      } finally {
        setInstituteLoading(false);
      }
    };

    fetchInstitutes();
    window.scrollTo(0, 0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedForm = sessionStorage.getItem('studentSignupForm');
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (err) {
        console.error('Failed to parse saved student form:', err);
      }
    }

    setEmailVerified(sessionStorage.getItem('studentEmailVerified') === 'true');
    setPhoneVerified(sessionStorage.getItem('studentPhoneVerified') === 'true');
  }, []);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...formErrors };

    if (name === "firstName" || name === "lastName") {
      const trimmed = (value || "").trim();
      const nameRegex = /^[A-Za-z ]+$/;
      if (!trimmed) {
        errors[name] = `${name === "firstName" ? "First" : "Last"} name is required`;
      } else if (!nameRegex.test(trimmed)) {
        errors[name] = "Name must contain only letters and spaces";
      } else if (trimmed.length < 2) {
        errors[name] = "Name is too short (minimum 2 characters)";
      } else if (trimmed.length > 50) {
        errors[name] = "Name is too long (maximum 50 characters)";
      } else {
        delete errors[name];
      }
    }

    if (name === "email") {
      const trimmed = (value || "").trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(trimmed)) {
        errors.email = "Please enter a valid email address";
      } else {
        const tld = trimmed.split('@')[1]?.split('.').pop() || '';
        if (/\d$/.test(tld)) {
          errors.email = "Invalid email domain – top-level domain cannot end with a number";
        } else {
          delete errors.email;
        }
      }
      // Clear duplicate error when user starts typing again
      setDuplicateEmailError("");
    }

    if (name === "mobileNumber") {
      const cleaned = (value || "").replace(/[\s\-+]/g, '');
      const phoneRegex = /^[6789]\d{9}$/;
      if (!cleaned) {
        errors.mobileNumber = "Mobile number is required";
      } else if (!phoneRegex.test(cleaned)) {
        errors.mobileNumber = "Mobile number must be a valid 10-digit Indian number starting with 6-9";
      } else {
        delete errors.mobileNumber;
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
          errors.password = "Password must contain at least one uppercase, one lowercase, one number, and one special character";
        } else {
          delete errors.password;
        }
      }
    }

    setFormErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate on change
    validateField(name, newValue);

    if (name === "graduationUniversity") {
      const filtered = institutes.filter((inst) =>
        inst.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInstitutes(filtered);
      setShowDropdown(true);
    }
  };

  const selectInstitute = (institute) => {
    setFormData((prev) => ({ ...prev, graduationUniversity: institute }));
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Verify Email handler with duplicate check
  const handleVerifyEmail = async () => {
    const email = formData.email.trim();

    // First run local format validation
    validateField("email", email);
    if (formErrors.email) {
      alert("Please fix the email format error first");
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setVerifyingEmail(true);
    setDuplicateEmailError(""); // clear previous duplicate message

    try {
      // Check for duplicate email BEFORE sending OTP
      const checkRes = await axios.post(`${apiConfig.API_BASE_URL}/api/auth/student/check-email`, { email });

      if (!checkRes.data.available) {
        setDuplicateEmailError("This email address is already registered. Please use a different email or login.");
        alert("This email is already taken. Please login or use another email.");
        setVerifyingEmail(false);
        return;
      }

      // Email is available → proceed with OTP
      sessionStorage.setItem('studentSignupForm', JSON.stringify(formData));

      // Your existing OTP flow
      await axios.post(`${apiConfig.API_BASE_URL}/api/auth/student/verify-email/send-otp`, {
        email,
        user_type: 'student'
      });

      navigate('/verify-email-otp', {
        state: {
          email,
          user_type: 'student',
          returnTo: '/signup'
        }
      });

    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.error?.includes("already")) {
        setDuplicateEmailError("This email address is already registered. Please use a different email or login.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } finally {
      setVerifyingEmail(false);
    }
  };

  // Verify Phone handler
  const handleVerifyPhone = async () => {
    const phone = formData.mobileNumber.trim().replace(/[\s\-+]/g, '');

    validateField("mobileNumber", phone);
    if (formErrors.mobileNumber) {
      alert("Please fix the phone number error first");
      return;
    }

    if (!phone || phone.length !== 10 || !/^[6789]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setVerifyingPhone(true);

    sessionStorage.setItem('studentSignupForm', JSON.stringify(formData));

    try {
      const res = await axios.post(`${apiConfig.API_BASE_URL}/api/auth/student/verify-phone/send-otp`, {
        phone,
        user_type: 'student'
      });

      if (res.data.success) {
        navigate('/verify-phone-otp', {
          state: {
            phone,
            user_type: 'student',
            returnTo: '/signup',
            isPhoneVerification: true
          }
        });
      } else {
        alert(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Final validation pass
    validateField("firstName", formData.firstName);
    validateField("lastName", formData.lastName);
    validateField("email", formData.email);
    validateField("mobileNumber", formData.mobileNumber);
    validateField("password", formData.password);

    if (Object.keys(formErrors).length > 0) {
      alert("Please fix all validation errors before submitting");
      return;
    }

    if (duplicateEmailError) {
      alert("Cannot create account: Email is already registered");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    if (!phoneVerified) {
      alert("Please verify your phone number first");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/signup`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          password: formData.password,
          graduationUniversity: formData.graduationUniversity.trim() || null,
        }
      );

      if (response.data.success) {
        // Cleanup session storage
        sessionStorage.removeItem('studentSignupForm');
        sessionStorage.removeItem('studentEmailVerified');
        sessionStorage.removeItem('studentPhoneVerified');

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", "student");

        alert("Account created successfully.");
        navigate("/dash");
      }

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong. Please try again.";
      if (errorMsg.includes("already registered") || errorMsg.includes("duplicate")) {
        setDuplicateEmailError("This email address is already registered. Please use a different email or login.");
      }
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* LEFT SIDE – BRANDING (unchanged) */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="text-4xl font-black tracking-tighter">Kristellar's LMS</div>
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
                "Money-Back Guarantee",
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
            <p className="text-sm opacity-70">© 2026 Kristellar Cyberspace Pvt. Ltd.</p>
          </div>
        </div>

        {/* RIGHT SIDE – FORMS */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Start Your Journey
              </h2>
              <p className="mt-3 text-gray-600">
                Create your account in 30 seconds
              </p>
            </div>

            {/* Social Buttons */}
            {/* <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 bg-[#1e40af] text-white py-4 rounded-xl font-medium hover:bg-[#1e3a8a] transition">
                <Mail className="w-5 h-5" /> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-[#1e40af] transition">
                <Phone className="w-5 h-5" /> Continue with Phone
              </button>
            </div> */}

            {/* <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div> */}
              {/* <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">OR</span>
              </div>
            </div> */}

            <form onSubmit={handleSignup} className="space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z ]/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="Rahul"
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z ]/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="Sharma"
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email with Verify Button + Duplicate Error Above */}
              <div>
                {duplicateEmailError && (
                  <div className="mb-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {duplicateEmailError}
                  </div>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={emailVerified}
                    className={`w-full pl-12 pr-36 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.email || duplicateEmailError
                        ? "border-red-500"
                        : emailVerified
                        ? "bg-green-50 border-green-300 text-green-700 cursor-not-allowed"
                        : "border-gray-300"
                    }`}
                  />
                  {emailVerified ? (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 font-medium flex items-center gap-1">
                      Verified ✓ <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={verifyingEmail || emailVerified || !formData.email.trim() || !!formErrors.email}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium rounded-md transition ${
                        emailVerified
                          ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                          : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {verifyingEmail ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
                {formErrors.email && !duplicateEmailError && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Phone with Verify Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    disabled={phoneVerified}
                    className={`w-full pl-12 pr-36 py-4 border rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition ${
                      formErrors.mobileNumber
                        ? "border-red-500"
                        : phoneVerified
                        ? "bg-green-50 border-green-300 text-green-700 cursor-not-allowed"
                        : "border-gray-300"
                    }`}
                  />
                  {phoneVerified ? (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 font-medium flex items-center gap-1">
                      Verified ✓ <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyPhone}
                      disabled={verifyingPhone || phoneVerified || !formData.mobileNumber.trim() || !!formErrors.mobileNumber}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium rounded-md transition ${
                        phoneVerified
                          ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                          : "bg-[#1e40af] text-white hover:bg-[#1e3a8a]"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {verifyingPhone ? "Sending..." : "Verify Phone"}
                    </button>
                  )}
                </div>
                {formErrors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.mobileNumber}</p>
                )}
              </div>

              {/* UNIVERSITY (unchanged) */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation / University
                </label>
                <div className="relative">
                  <School className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="graduationUniversity"
                    value={formData.graduationUniversity}
                    onChange={handleChange}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search your institute..."
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {instituteLoading ? (
                      <p className="p-4 text-center text-gray-500">
                        Loading institutes...
                      </p>
                    ) : filteredInstitutes.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">
                        No institutes found
                      </p>
                    ) : (
                      filteredInstitutes.map((institute, i) => (
                        <div
                          key={i}
                          onClick={() => selectInstitute(institute)}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                        >
                          {institute}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* PASSWORD */}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1e40af] rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-3 text-sm text-gray-600"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#1e40af] font-medium hover:underline">
                    Terms & Conditions {" "}
                  </Link>
                  and{" "}
                  <Link to="/privacy" className="text-[#1e40af] font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.agreeTerms ||
                  !emailVerified ||
                  !phoneVerified ||
                  Object.keys(formErrors).length > 0 ||
                  !!duplicateEmailError
                }
                className="w-full bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Free Account"}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-10 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#1e40af] font-bold hover:underline"
                >
                  Login Here
                </button>
              </p>
            </div>

            {/* <p className="text-center text-xs text-gray-500 mt-10">
              By signing up, you agree to receive course updates via WhatsApp & Email.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;