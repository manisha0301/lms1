// src/pages/auth/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';


const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    graduationUniversity: '',
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const sendOTP = async (type) => {
    navigate('/otp', { state: { phone: form.phone, email: form.email, type, fromSignup: true } })
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.termsAccepted) return alert("Please accept terms & conditions");
    if (!emailVerified || !phoneVerified) return alert("Please verify both email and phone");

    setLoading(true);
    try {
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyComplete = () => {
  //   window.location.href = '/student/home';
  // };

  // if (otpSent) {
  //   return <VerifyOTP email={form.email} phone={form.phone} onVerify={handleVerifyComplete} />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join Cybernetics LMS Today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
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

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="graduationUniversity"
            placeholder="Graduation University Name"
            value={form.graduationUniversity}
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
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the <Link to="/terms" className="text-blue-600 underline">Terms & Conditions</Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !form.termsAccepted || !emailVerified || !phoneVerified}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;




