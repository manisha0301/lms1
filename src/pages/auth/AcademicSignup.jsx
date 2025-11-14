// src/pages/auth/AcademicSignup.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AcademicSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ----- form state -------------------------------------------------
  const [form, setForm] = useState({
    name: '',
    email: '',
    dob: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    termsAccepted: false,
  });

  // ----- verification flags -----------------------------------------
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // ----- password match --------------------------------------------
  const [passwordError, setPasswordError] = useState('');

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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ----- OTP navigation ---------------------------------------------
  const sendOTP = (type) => {
    if (type === 'email' && !form.email) return alert('Enter email first');
    if (type === 'phone' && !form.phone) return alert('Enter phone first');

    const payload = {
      email: form.email,
      phone: form.phone,
      type,
      fromSignup: true,
      returnTo: '/academic-signup',
    };

    navigate('/otp', { state: payload });
  };

  // ----- final submit ------------------------------------------------
  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.termsAccepted) return alert('Accept Terms & Conditions');
    if (!emailVerified || !phoneVerified)
      return alert('Please verify both email and phone');
    if (form.password !== form.confirmPassword)
      return alert('Passwords do not match');
    if (form.password.length < 6)
      return alert('Password must be ≥ 6 characters');

    console.log('Academic Signup submitted:', form);
    alert('Account created successfully! (Demo mode)');
  };

  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Your Academic Account
            </h1>
            <p className="text-gray-600 mt-2">Join Cybernetics LMS Academic</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* ---------- Full Name ---------- */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

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
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

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

            <textarea
              name="address"
              placeholder="Street Address"
              value={form.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

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

export default AcademicSignup;