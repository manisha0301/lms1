// src/pages/auth/FacultySignup.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { School, ChevronDown, Check, X } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
 
const FacultySignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: '',
    designation: '',
    qualification: '',
    shortCV: '',
    profilePicture: null,
    linkedin: '',
    instagram: '',
    facebook: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    university: '',
  });
 
  // Validation states
  const [formErrors, setFormErrors] = useState({});
  const [emailDuplicateError, setEmailDuplicateError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);
 
  // University dropdown logic
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [universityLoading, setUniversityLoading] = useState(true);
  const dropdownRef = useRef(null);
 
  // Restore saved form on mount
  useEffect(() => {
    const savedForm = sessionStorage.getItem('facultySignupForm');
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (err) {
        console.error('Failed to parse saved form data:', err);
      }
    }
 
    setEmailVerified(sessionStorage.getItem('facultyEmailVerified') === 'true');
    setPhoneVerified(sessionStorage.getItem('facultyPhoneVerified') === 'true');
  }, []);
 
  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/auth/superadmin/institutes`);
        if (res.data.success) {
          setUniversities(res.data.institutes);
          setFilteredUniversities(res.data.institutes);
        }
      } catch (err) {
        setUniversities([]);
        setFilteredUniversities([]);
      } finally {
        setUniversityLoading(false);
      }
    };
    fetchUniversities();
  }, []);
 
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  // Password match check
  useEffect(() => {
    if (form.password || form.confirmPassword) {
      setPasswordError(
        form.password !== form.confirmPassword ? 'Passwords do not match' : ''
      );
    } else {
      setPasswordError('');
    }
  }, [form.password, form.confirmPassword]);
 
  // Real-time field validation
  const validateField = (name, value) => {
    const errors = { ...formErrors };
 
    if (name === 'firstName' || name === 'lastName') {
      const trimmed = (value || '').trim();
      const nameRegex = /^[A-Za-z ]+$/;
      if (!trimmed) {
        errors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
      } else if (!nameRegex.test(trimmed)) {
        errors[name] = 'Name must contain only letters and spaces';
      } else if (trimmed.length < 2) {
        errors[name] = 'Name is too short (minimum 2 characters)';
      } else if (trimmed.length > 50) {
        errors[name] = 'Name is too long (maximum 50 characters)';
      } else {
        delete errors[name];
      }
    }
 
    if (name === 'email') {
      const trimmed = (value || '').trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(trimmed)) {
        errors.email = 'Please enter a valid email address';
      } else {
        const tld = trimmed.split('@')[1]?.split('.').pop() || '';
        if (/\d$/.test(tld)) {
          errors.email = 'Invalid email domain – top-level domain cannot end with a number';
        } else {
          delete errors.email;
        }
      }
      // Clear duplicate error when user types
      setEmailDuplicateError('');
    }
 
    if (name === 'phone') {
      const cleaned = (value || '').replace(/[\s\-+]/g, '');
      const phoneRegex = /^[6789]\d{9}$/;
      if (!cleaned) {
        errors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(cleaned)) {
        errors.phone = 'Phone must be a valid 10-digit Indian number starting with 6-9';
      } else {
        delete errors.phone;
      }
    }
 
    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8 || value.length > 16) {
        errors.password = 'Password must be between 8 and 16 characters long';
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
        if (!passwordRegex.test(value)) {
          errors.password = 'Password must contain uppercase, lowercase, number & special character';
        } else {
          delete errors.password;
        }
      }
    }
 
    setFormErrors(errors);
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
 
    if (type === 'file') {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setProfilePreview(null);
      }
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
 
      // Validate on change
      validateField(name, value);
 
      if (name === 'university') {
        const filtered = universities.filter((u) =>
          u.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUniversities(filtered);
        setShowDropdown(true);
      }
    }
  };
 
  const selectUniversity = (university) => {
    setForm((prev) => ({ ...prev, university }));
    setShowDropdown(false);
  };
 
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
 
  const countWords = (text) =>
    text.trim().split(/\s+/).filter((w) => w.length > 0).length;
 
  // Real-time email duplicate check
  const checkEmailDuplicate = async (emailValue) => {
    if (!emailValue || formErrors.email) return;
 
    try {
      const res = await axios.post(`${apiConfig.API_BASE_URL}/api/faculty/check-email`, { email: emailValue });
      if (!res.data.available) {
        setEmailDuplicateError('This email is already registered. Please use another email or login.');
      } else {
        setEmailDuplicateError('');
      }
    } catch (err) {
      console.error('Email check failed:', err);
      setEmailDuplicateError('Could not check email availability. Try again.');
    }
  };
 
  // Handle Verify Email
  const handleVerifyEmail = async () => {
    const emailValue = form.email.trim();
 
    // Validate first
    validateField('email', emailValue);
    if (formErrors.email || emailDuplicateError) {
      alert('Please fix email errors first');
      return;
    }
 
    // Save form state
    sessionStorage.setItem('facultySignupForm', JSON.stringify(form));
 
    setVerifyingEmail(true);
 
    try {
      // Final duplicate check before OTP
      const checkRes = await axios.post(`${apiConfig.API_BASE_URL}/api/faculty/check-email`, { email: emailValue });
      if (!checkRes.data.available) {
        setEmailDuplicateError('This email is already registered. Please use another email or login.');
        alert('Email already taken');
        return;
      }
 
      // Send OTP
      await axios.post(`${apiConfig.API_BASE_URL}/api/faculty/verify-email/send-otp`, {
        email: emailValue,
        user_type: 'faculty'
      });
 
      navigate('/verify-email-otp', {
        state: {
          email: emailValue,
          user_type: 'faculty',
          returnTo: '/signup'
        }
      });
    } catch (err) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };
 
  // Handle Verify Phone
  const handleVerifyPhone = async () => {
    let phoneValue = form.phone.trim().replace(/\D/g, '');
    if (phoneValue.startsWith('91') && phoneValue.length === 12) {
      phoneValue = phoneValue.substring(2);
    }
 
    validateField('phone', phoneValue);
    if (formErrors.phone) {
      alert('Please fix phone number errors first');
      return;
    }
 
    sessionStorage.setItem('facultySignupForm', JSON.stringify(form));
 
    setVerifyingPhone(true);
 
    try {
      const res = await axios.post(`${apiConfig.API_BASE_URL}/api/faculty/verify-phone/send-otp`, {
        phone: phoneValue,
        user_type: 'faculty'
      });
      if (res.data.success) {
        navigate('/verify-phone-otp', {
          state: {
            phone: phoneValue,
            user_type: 'faculty',
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
 
  // Final signup handler with all validations
  const handleSignup = async (e) => {
    e.preventDefault();
 
    // 1. Run final validation on all fields
    validateField('firstName', form.firstName);
    validateField('lastName', form.lastName);
    validateField('email', form.email);
    validateField('phone', form.phone);
    validateField('password', form.password);
 
    if (Object.keys(formErrors).length > 0 || emailDuplicateError) {
      alert('Please fix all validation errors before submitting');
      return;
    }
 
    if (!form.termsAccepted) return alert('Accept Terms & Conditions');
    if (!emailVerified) return alert('Please verify your email first');
    if (!phoneVerified) return alert('Please verify your phone number first');
    if (form.shortCV && countWords(form.shortCV) > 100)
      return alert('Short CV must be ≤ 100 words');
    if (form.password !== form.confirmPassword)
      return alert('Passwords do not match');
    if (form.password.length < 8)
      return alert('Password must be at least 8 characters');
 
    setSubmitting(true);
 
    const formData = new FormData();
    formData.append('firstName', form.firstName.trim());
    formData.append('lastName', form.lastName.trim());
    formData.append('email', form.email.toLowerCase().trim());
    formData.append('phone', form.phone.trim());
    formData.append('address', form.address.trim());
    formData.append('designation', form.designation.trim());
    formData.append('qualification', form.qualification.trim());
    formData.append('shortCV', form.shortCV.trim());
    formData.append('linkedinUrl', form.linkedin.trim());
    formData.append('instagramUrl', form.instagram.trim());
    formData.append('facebookUrl', form.facebook.trim());
    formData.append('password', form.password);
    formData.append('employmentStatus', form.employmentStatus);
    formData.append('university', form.university.trim() || '');
    if (form.profilePicture) {
      formData.append('profilePicture', form.profilePicture);
    }
 
    try {
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/faculty/signup`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
 
      if (data.success) {
        // Cleanup session storage
        sessionStorage.removeItem('facultySignupForm');
        sessionStorage.removeItem('facultyEmailVerified');
        sessionStorage.removeItem('facultyPhoneVerified');
 
        setProfilePreview(null);
        setEmailVerified(false);
        setPhoneVerified(false);
       
        alert(
          'Signup successful! Your account is pending admin approval.\nYou will be notified once approved.'
        );
 
        // Reset form
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          employmentStatus: '',
          designation: '',
          qualification: '',
          shortCV: '',
          profilePicture: null,
          linkedin: '',
          instagram: '',
          facebook: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false,
          university: '',
        });
 
        navigate('/login');
      } else {
        alert('Signup failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Your Faculty Account
            </h1>
            <p className="text-gray-600 mt-2">
              Join Cybernetics LMS Professional Network
            </p>
          </div>
 
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>
            </div>
 
            {/* University Dropdown */}
            <div className="relative mb-4" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University / Institute
              </label>
              <div className="relative">
                <School className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search your university..."
                  className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {universityLoading ? (
                    <p className="p-4 text-center text-gray-500">Loading universities...</p>
                  ) : filteredUniversities.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No universities found</p>
                  ) : (
                    filteredUniversities.map((university, i) => (
                      <div
                        key={i}
                        onClick={() => selectUniversity(university)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {university}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
 
            {/* Email + Verify + Duplicate Error */}
            <div>
              {emailDuplicateError && (
                <p className="mb-2 text-sm text-red-600">{emailDuplicateError}</p>
              )}
 
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => checkEmailDuplicate(form.email.trim())}
                  required
                  disabled={emailVerified}
                  className={`w-full px-4 py-3 pr-36 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email || emailDuplicateError
                      ? 'border-red-500'
                      : emailVerified
                      ? 'bg-green-50 border-green-300 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={
                    verifyingEmail ||
                    emailVerified ||
                    !form.email.trim() ||
                    !!formErrors.email ||
                    !!emailDuplicateError
                  }
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium rounded-md transition ${
                    emailVerified
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {emailVerified ? 'Verified ✓' : verifyingEmail ? 'Sending...' : 'Verify Email'}
                </button>
              </div>
              {formErrors.email && !emailDuplicateError && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
 
            {/* Phone + Verify */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={phoneVerified}
                className={`w-full px-4 py-3 pr-36 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  formErrors.phone
                    ? 'border-red-500'
                    : phoneVerified
                    ? 'bg-green-50 border-green-300 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              />
              {phoneVerified ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-md flex items-center gap-1">
                  Verified <Check className="w-4 h-4" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={verifyingPhone || phoneVerified || !form.phone.trim() || !!formErrors.phone}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium rounded-md transition ${
                    verifyingPhone
                      ? 'bg-gray-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {verifyingPhone ? 'Sending...' : 'Verify Phone'}
                </button>
              )}
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>
 
            {/* Rest of the form remains unchanged */}
            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employmentStatus"
                    value="Employed"
                    checked={form.employmentStatus === 'Employed'}
                    onChange={handleChange}
                    required
                    className="mr-2 text-blue-600"
                  />
                  <span>Employed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employmentStatus"
                    value="Unemployed"
                    checked={form.employmentStatus === 'Unemployed'}
                    onChange={handleChange}
                    className="mr-2 text-blue-600"
                  />
                  <span>Unemployed</span>
                </label>
              </div>
            </div>
 
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="designation"
                placeholder="Current Designation"
                value={form.designation}
                onChange={handleChange}
                disabled={form.employmentStatus === 'Unemployed'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <input
                type="text"
                name="qualification"
                placeholder="Highest Qualification"
                value={form.qualification}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short CV (Max 100 words) — {countWords(form.shortCV)} words
              </label>
              <textarea
                name="shortCV"
                placeholder="Briefly describe your experience, skills, and goals..."
                value={form.shortCV}
                onChange={handleChange}
                rows="5"
                maxLength="800"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {profilePreview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={profilePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full border-4 border-blue-200"
                  />
                </div>
              )}
            </div>
 
            <div className="grid md:grid-cols-3 gap-5">
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile URL"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                name="instagram"
                placeholder="Instagram Profile URL"
                value={form.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                name="facebook"
                placeholder="Facebook Profile URL"
                value={form.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
 
            <div>
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="8"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
 
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength="8"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  passwordError || formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
 
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
                required
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
 
            <button
              type="submit"
              disabled={
                submitting ||
                !form.termsAccepted ||
                !!passwordError ||
                !!formErrors.password ||
                !!formErrors.firstName ||
                !!formErrors.lastName ||
                !!formErrors.email ||
                !!formErrors.phone ||
                !!emailDuplicateError ||
                !emailVerified ||
                !phoneVerified
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
 
          <p className="text-center mt-8 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default FacultySignup;