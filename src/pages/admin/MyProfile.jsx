// src/pages/admin/MyProfile.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Loader2,
  MessageSquare,
  Download,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Home,
  Globe,
  Lock,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Simulate fetching admin data
    setTimeout(() => {
      const fetchedAdmin = {
        fullName: "Dr. Rajesh Kumar",
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "admin@codekart.com",
        username: "admin_rajesh",
        phone: "+91 98765 43210", // Added for completeness, based on other files
        dob: "1980-05-15",
        address: "Plot No 504/2382/2701, First Floor, Kanan Vihar, Phase 2, Patia",
        city: "Bhubaneswar",
        postalCode: "751024",
        country: "India",
        role: "Super Admin",
        joined: "01 Jan 2020",
        bio: "Experienced administrator overseeing CodeKart LMS operations. Passionate about education technology and student success.",
      };
      setAdmin(fetchedAdmin);
      setFormData(fetchedAdmin);
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    // In real app: API call to update profile
    setAdmin(formData);
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#1e3a8a] animate-spin mx-auto mb-6" />
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="opacity-90 mt-1">View and manage your admin profile</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-2">
        {/* Main Profile Card - Inspired by ViewStudentDetails and SettingsAdmin */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left: Photo + Status */}
              <div className="text-center flex-shrink-0">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl ring-8 ring-blue-50">
                  {admin.firstName[0]}
                  {admin.lastName[0]}
                </div>
                <p className="mt-6 text-sm font-medium text-orange-600 flex items-center gap-2 justify-center">
                  <Calendar className="w-5 h-5" />
                  Joined {admin.joined}
                </p>
                <span className="mt-6 inline-block px-6 py-3 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                  ACTIVE
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex-1 space-y-8">
                {/* Name + Role */}
                <div className="flex justify-between items-start">
                  <div>
                    {editMode ? (
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="text-2xl font-black text-gray-900 border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                      />
                    ) : (
                      <h3 className="text-2xl font-black text-gray-900">{admin.fullName}</h3>
                    )}
                    <p className="text-lg text-[#1e3a8a] font-semibold mt-2">{admin.role}</p>
                  </div>
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        onClick={saveChanges}
                        className="px-6 py-2 bg-[#1e3a8a] text-white rounded-xl flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={() => {
                          setFormData(admin);
                          setEditMode(false);
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-xl flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-[#1e3a8a] hover:text-blue-800 flex items-center gap-2"
                    >
                      <Edit className="w-5 h-5" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Contact & Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.username}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.dob}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Home className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.address}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.city}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.postalCode}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Globe className="w-6 h-6 text-[#1e3a8a]" />
                    {editMode ? (
                      <input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.country}</span>
                    )}
                  </div>
                </div>

                {/* Bio / Short Summary */}
                <div className="pt-6 border-t-2 border-dashed border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                    <Shield className="w-6 h-6 text-[#1e3a8a]" />
                    About Me
                  </h4>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl text-base">
                      {admin.bio}
                    </p>
                  )}
                </div>

                {/* Action Buttons (if not in edit mode) */}
                {!editMode && (
                  <div className="flex justify-end gap-5 pt-8 border-t-2 border-gray-200">
                    <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition">
                      Change Password
                    </button>
                    <button className="px-10 py-4 bg-[#1e3a8a] text-white rounded-xl hover:bg-blue-800 font-bold shadow-lg flex items-center gap-3 transition hover:scale-105">
                      <Lock className="w-6 h-6" />
                      Update Security
                    </button>
                    <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-3 transition hover:scale-105">
                      <Download className="w-6 h-6" />
                      Download Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;