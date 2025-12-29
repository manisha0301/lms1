// // src/pages/auth/Signup.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Mail, Lock, User, Phone, School, Calendar, Check, ArrowRight } from "lucide-react";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
//       <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

//         {/* LEFT SIDE - Motivational & Branding */}
//         <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute inset-0 bg-black/10"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-10">
//               <div className="text-4xl font-black tracking-tighter">CodeKart</div>
//             </div>
//             <h1 className="text-5xl font-bold leading-tight mb-6">
//               Your Journey to a <span className="text-green-400">6-Figure Tech Career</span> Starts Here
//             </h1>
//             <p className="text-xl opacity-90 mb-10">
//               Join 50,000+ students learning from India's top mentors with live classes, real projects & 100% placement support.
//             </p>

//             <div className="space-y-5 text-lg">
//               {[
//                 "Live Interactive Classes Daily",
//                 "1:1 Mentorship from Industry Experts",
//                 "100+ Hiring Partners",
//                 "Lifetime Access + Certificate",
//                 "Money-Back Guarantee"
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center gap-4">
//                   <Check className="w-7 h-7 text-green-400 flex-shrink-0" />
//                   <span>{item}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-12 flex items-center gap-8">
//               <div>
//                 <div className="text-4xl font-bold">50K+</div>
//                 <div className="text-sm opacity-80">Students Enrolled</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold">4.9</div>
//                 <div className="text-sm opacity-80">Average Rating</div>
//               </div>
//               <div>
//                 <div className="text-4xl font-bold">₹12 LPA</div>
//                 <div className="text-sm opacity-80">Avg Placement</div>
//               </div>
//             </div>
//           </div>

//           <div className="relative z-10 mt-16 text-center">
//             <p className="text-sm opacity-70">
//               © 2025 CodeKart Solutions Pvt. Ltd. • CIN: U72900OR2021PTC036225
//             </p>
//           </div>
//         </div>

//         {/* RIGHT SIDE - Login / Sign Up Form */}
//         <div className="p-10 lg:p-16 flex flex-col justify-center">
//           <div className="max-w-md mx-auto w-full">
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 {isLogin ? "Welcome Back!" : "Start Your Journey"}
//               </h2>
//               <p className="mt-3 text-gray-600">
//                 {isLogin ? "Login to continue learning" : "Create your account in 30 seconds"}
//               </p>
//             </div>

//             {/* Social Login Buttons */}
//             <div className="space-y-3 mb-8">
//               <button className="w-full flex items-center justify-center gap-3 bg-[#1e40af] text-white py-4 rounded-xl font-medium hover:bg-[#1e3a8a] transition">
//                 <Mail className="w-5 h-5" />
//                 Continue with Google
//               </button>
//               <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-[#1e40af] transition">
//                 <Phone className="w-5 h-5" />
//                 Continue with Phone
//               </button>
//             </div>

//             <div className="relative mb-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-white px-4 text-gray-500">OR</span>
//               </div>
//             </div>

//             {/* // Login Form */}
//             <form className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="you@example.com or +919876543210"
//                     className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af]"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af]"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={() => navigate("/student/dash")}
//                 className="w-full bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition">
//                 Login to Dashboard
//               </button>
//             </form>

//             <div className="mt-10 text-center">
//               <p className="text-gray-600">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="text-[#1e40af] font-bold hover:underline"
//                 >
//                   Sign Up Free
//                 </button>
//               </p>
//             </div>

//             <p className="text-center text-xs text-gray-500 mt-10">
//               By signing up, you agree to receive course updates via WhatsApp & Email.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;







// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Phone } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // alert("Login successful! Welcome back to CodeKart");
        navigate("/dash");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Motivational & Branding */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="text-4xl font-black tracking-tighter">CodeKart</div>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome Back to <span className="text-green-400">CodeKart</span>
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Continue your journey to a 6-figure tech career with live classes, projects & placements.
            </p>
          </div>
          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">© 2025 CodeKart Solutions Pvt. Ltd.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="mt-3 text-gray-600">Login to continue learning</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center gap-3 bg-[#1e40af] text-white py-4 rounded-xl font-medium hover:bg-[#1e3a8a] transition">
                <Mail className="w-5 h-5" /> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-[#1e40af] transition">
                <Phone className="w-5 h-5" /> Continue with Phone
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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="identifier"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="you@example.com or +919876543210"
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
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")} className="text-[#1e40af] font-bold hover:underline">
                  Sign Up Free
                </button>
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

export default Login;