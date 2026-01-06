// src/pages/auth/FacultySignup.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);

  useEffect(() => {
    if (location.state?.emailVerified) setEmailVerified(true);
    if (location.state?.phoneVerified) setPhoneVerified(true);
  }, [location.state]);

  useEffect(() => {
    if (form.password || form.confirmPassword) {
      setPasswordError(
        form.password !== form.confirmPassword ? 'Passwords do not match' : ''
      );
    } else {
      setPasswordError('');
    }
  }, [form.password, form.confirmPassword]);

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
    }
  };

  const countWords = (text) =>
    text.trim().split(/\s+/).filter((w) => w.length > 0).length;

  const sendOTP = (type) => {
    if (type === 'email' && !form.email) return alert('Enter email first');
    if (type === 'phone' && !form.phone) return alert('Enter phone first');

    const payload = {
      email: form.email,
      phone: form.phone,
      type,
      fromSignup: true,
      returnTo: '/faculty-signup',
    };

    navigate('/otp', { state: payload });
  };

  // REAL API SUBMIT
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.termsAccepted) return alert('Accept Terms & Conditions');
    // if (!emailVerified || !phoneVerified)
    //   return alert('Please verify both email and phone');
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

    if (form.profilePicture) {
      formData.append('profilePicture', form.profilePicture);
    }

    try {
      const res = await fetch('http://localhost:5000/api/faculty/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert('Signup successful! Your account is pending admin approval.\nYou will be notified once approved.');
        navigate('/login'); // or home page
      } else {
        alert('Signup failed: ' + data.error);
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
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email + Verify */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-36 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => sendOTP('email')}
                disabled={verifyingEmail || emailVerified}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium rounded-md transition ${
                  emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${verifyingEmail ? 'opacity-50' : ''}`}
              >
                {emailVerified ? 'Verified' : verifyingEmail ? 'Sending...' : 'Verify Email'}
              </button>
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
                className="w-full px-4 py-3 pr-36 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => sendOTP('phone')}
                disabled={verifyingPhone || phoneVerified}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium rounded-md transition ${
                  phoneVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${verifyingPhone ? 'opacity-50' : ''}`}
              >
                {phoneVerified ? 'Verified' : verifyingPhone ? 'Sending...' : 'Verify Phone'}
              </button>
            </div>

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

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="8"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
            />

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
                  passwordError ? 'border-red-500' : 'border-gray-300'
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
                passwordError ||
                !form.password ||
                form.password.length < 8
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