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

  // ----- verification flags -----------------------------------------
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // ----- password match --------------------------------------------
  const [passwordError, setPasswordError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);

  // ----- keep verification state after OTP page returns -------------
  useEffect(() => {
    if (location.state?.emailVerified) setEmailVerified(true);
    if (location.state?.phoneVerified) setPhoneVerified(true);
  }, [location.state]);

  // ----- password match validation ----------------------------------
  useEffect(() => {
    if (form.password || form.confirmPassword) {
      setPasswordError(
        form.password !== form.confirmPassword ? 'Passwords do not match' : ''
      );
    } else {
      setPasswordError('');
    }
  }, [form.password, form.confirmPassword]);

  // ----- generic change handler -------------------------------------
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

  // ----- word counter for short CV ----------------------------------
  const countWords = (text) =>
    text.trim().split(/\s+/).filter((w) => w.length > 0).length;

  // ----- OTP navigation ---------------------------------------------
  const sendOTP = (type) => {
    if (type === 'email' && !form.email) return alert('Enter email first');
    if (type === 'phone' && !form.phone) return alert('Enter phone first');

    const payload = {
      email: form.email,
      phone: form.phone,
      type,
      fromSignup: true,
      returnTo: '/faculty-signup', // optional – OTP page can use it
    };

    navigate('/otp', { state: payload });
  };

  // ----- final submit ------------------------------------------------
  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.termsAccepted) return alert('Accept Terms & Conditions');
    if (!emailVerified || !phoneVerified)
      return alert('Please verify both email and phone');
    if (form.shortCV && countWords(form.shortCV) > 100)
      return alert('Short CV must be ≤ 100 words');
    if (form.password !== form.confirmPassword)
      return alert('Passwords do not match');
    if (form.password.length < 6)
      return alert('Password must be ≥ 6 characters');

    // ---- demo mode (replace with real API call) ----
    console.log('Faculty Signup submitted:', {
      ...form,
      profilePicture: form.profilePicture?.name ?? null,
    });
    alert('Account created successfully! (Demo mode)');
  };

  // -----------------------------------------------------------------
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
            {/* ---------- Name ---------- */}
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

            {/* ---------- Email (with verify) ---------- */}
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
                {emailVerified
                  ? 'Verified'
                  : verifyingEmail
                  ? 'Sending...'
                  : 'Verify Email'}
              </button>
            </div>

            {/* ---------- Phone (with verify) ---------- */}
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
                {phoneVerified
                  ? 'Verified'
                  : verifyingPhone
                  ? 'Sending...'
                  : 'Verify Phone'}
              </button>
            </div>

            {/* ---------- Rest of the fields (unchanged) ---------- */}
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
                    value="employed"
                    checked={form.employmentStatus === 'employed'}
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
                    value="unemployed"
                    checked={form.employmentStatus === 'unemployed'}
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
                disabled={form.employmentStatus === 'unemployed'}
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
              minLength="6"
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
                minLength="6"
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
                !form.termsAccepted ||
                passwordError ||
                !form.password ||
                form.password.length < 6 ||
                !emailVerified ||
                !phoneVerified
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
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