// src/pages/superadmin/MyProfile.jsx
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  Edit3,
  Save,
  X,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
  Clock,
  Activity,
  Shield,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock Super Admin Data
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@kristellar.com",
    phone: "+91 98765 43210",
    role: "Super Administrator",
    joiningDate: "2023-01-01",
    lastLogin: "2025-12-15 10:30 AM",
    twoFactor: true,
    emailVerified: true,
    recentActivities: [
      "Approved new academic admin",
      "Updated system settings",
      "Reviewed finance reports",
      "Resolved server alert"
    ]
  });

  const [editData, setEditData] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] border border-gray-200 shadow-sm p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-white mt-1">Manage your personal information and security settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.name}</h2>
                <p className="text-[#1e3a8a] font-medium">{profile.role}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <Users className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">2,847</p>
                    <p className="text-xs text-gray-600">Users Managed</p>
                  </div>
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">99.9%</p>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                  <p className="text-gray-900">{profile.joiningDate}</p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Email Verified</span>
                  </div>
                  {profile.emailVerified ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Two-Factor Authentication</span>
                  </div>
                  {profile.twoFactor ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium">
                  <Key className="w-5 h-5" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {profile.recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm p-4 bg-[#1e3a8a]/5 rounded-xl">
                    <Activity className="w-4 h-4 text-[#1e3a8a] mt-0.5" />
                    <p className="text-gray-700">{act}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Kristellar • Super Admin Portal
      </footer>
    </div>
  );
}