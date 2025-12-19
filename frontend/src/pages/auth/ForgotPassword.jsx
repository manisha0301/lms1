// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Simulate sending email
      setTimeout(() => {
        alert(`Reset link sent to ${email}`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-white-100 to-white-400 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-0 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Left Side - Form */}
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Back to Login */}
              <Link 
                to="/login" 
                className="text-white/80 hover:text-white text-sm flex items-center gap-2 mb-8 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Forgot Password
              </h1>
              <p className="text-white text-lg mb-10">
                Enter your e-mail address, and we'll give you reset instruction.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter E-mail Address"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white focus:outline-none focus:ring-4 focus:ring-white/40 transition backdrop-blur"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    Send New Password
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Check Your Email</h3>
                  <p className="text-white/80">
                    We have sent password reset instructions to
                  </p>
                  <p className="text-white font-semibold mt-2">{email}</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-white/80 hover:text-white underline text-sm"
                  >
                    ← Send to another email
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden md:flex items-center justify-center bg-white/10 backdrop-blur-xl p-16">
            <div className="relative">
              {/* Envelope Icon */}
              <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center">
                <Mail className="w-24 h-24 text-white" />
              </div>
              {/* Paper Plane */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
                <Send className="w-12 h-12 text-white rotate-45" />
              </div>
              {/* Question Mark */}
              <div className="absolute -top-8 -left-8 text-white text-6xl font-bold opacity-30">
                ?
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white mt-10 text-sm">
          © 2025 Cybernetics LMS • All Rights Reserved
        </p>
      </div>
    </div>
  );
}