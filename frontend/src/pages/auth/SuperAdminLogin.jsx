// src/pages/auth/SuperAdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const SuperAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual super admin login endpoint
      const response = await fetch("http://localhost:5000/api/auth/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.setItem("superAdminToken", data.token);        // ← Same key as Courses page
        localStorage.setItem("superAdminUser", JSON.stringify(data.user));  // Optional: save user info 
        
        // alert("Super Admin Login Successful!");
        navigate("/dash");
        
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a]/5 via-white to-green-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Branding (Matching LMS Design) */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tighter mb-10">Kristellar Aerospace</div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Super Admin <span className="text-green-400">Portal</span>
            </h1>
            <p className="text-xl opacity-90 mb-10">
              Manage organizations, courses, faculty, and the entire LMS ecosystem.
            </p>
            <div className="space-y-3 text-lg opacity-80">
              <p>Kristellar Aerospace Solutions Pvt. Ltd.</p>
              {/* <p className="text-sm mt-8">Plot No 504/2382/2701, First Floor, Kanan Vihar, Phase 2, Patia, BHUBANESWAR, ODISHA (751024), INDIA</p> */}
            </div>
          </div>
          <div className="relative z-10 mt-16 text-center">
            <p className="text-sm opacity-70">© 2025 Kristellar Aerospace Solutions Pvt. Ltd. All Rights Reserved.</p>
          </div>
        </div>

        {/* RIGHT SIDE - Super Admin Login Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Super Admin Login</h2>
              <p className="mt-3 text-gray-600">Restricted access for Kristellar Aerospace management only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
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
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                // onClick={()=> navigate('/dash')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e40af] to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login as Super Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;