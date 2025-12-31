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
  Eye, 
  EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          alert("Please login again");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          const profile = data.profile;
          setAdmin(profile);
          setFormData(profile);
        } else {
          alert("Failed to load profile: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Network error — check if backend is running");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes to backend (PUT request)
  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobile: formData.mobile,
          dateOfBirth: formData.dob,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          about: formData.about,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAdmin(data.profile);
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert("Update failed: " + data.error);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error — changes not saved");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    
  // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordSubmit = async () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm the new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/auth/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.success) {
        alert("Password changed successfully!");
        setShowChangePasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Password change failed. Please check your connection.");
      console.error(error);
    }
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

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="  mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="opacity-90 mt-1">View and manage your admin profile</p>
            </div>
          </div>
        </div>
      </header>

      <div className="  mx-auto px-8 py-2">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left: Photo + Status */}
              <div className="text-center flex-shrink-0">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl ring-8 ring-blue-50">
                  {admin.fullName
                    ? admin.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
                    : 'A'}
                </div>
                <p className="mt-6 text-sm font-medium text-orange-600 flex items-center gap-2 justify-center">
                  <Calendar className="w-5 h-5" />
                  Joined {admin.joinedAt 
                    ? new Date(admin.joinedAt).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })
                    : 'N/A'}
                </p>
                <span className="mt-6 inline-block px-6 py-3 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                  {admin.status || 'ACTIVE'}
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
                        value={formData.fullName || ''}
                        onChange={handleInputChange}
                        className="text-2xl font-black text-gray-900 border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                      />
                    ) : (
                      <h3 className="text-2xl font-black text-gray-900">{admin.fullName}</h3>
                    )}
                    <p className="text-lg text-[#1e3a8a] font-semibold mt-2">{admin.role || 'Academic Admin'}</p>
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
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.mobile}</span>
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
                      <span className="font-medium">
                        {admin.dateOfBirth 
                          ? new Date(admin.dateOfBirth).toLocaleDateString('en-CA') // YYYY-MM-DD format
                          : 'Not provided'
                        }
                      </span>
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
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="font-medium border-b border-gray-300 focus:outline-none focus:border-[#1e3a8a] w-full"
                      />
                    ) : (
                      <span className="font-medium">{admin.pincode}</span>
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

                {/* Institution */}
                <div className="pt-6 border-t-2 border-dashed border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                    <Shield className="w-6 h-6 text-[#1e3a8a]" />
                    Institution
                  </h4>
                  <p className="text-gray-700 text-lg font-medium">
                    {admin.institution || 'Not assigned'}
                  </p>
                </div>

                {/* About Me */}
                <div className="pt-6 border-t-2 border-dashed border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                    <Shield className="w-6 h-6 text-[#1e3a8a]" />
                    About Me
                  </h4>
                  {editMode ? (
                    <textarea
                      name="about"
                      value={formData.about || ''}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl text-base">
                      {admin.about || 'No about section added yet.'}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                {!editMode && (
                  <div className="flex justify-end gap-5 pt-8 border-t-2 border-gray-200">
                    <button 
                      onClick={() => setShowChangePasswordModal(true)} 
                      className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#1e3a8a] text-white px-6 py-5">
              <h3 className="text-xl font-bold">Change Password</h3>
              <p className="text-blue-100 mt-1 text-sm">Update your account password</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${passwordErrors.newPassword ? "border-red-500" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 bg-gray-50 flex justify-end gap-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordErrors({});
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-blue-800 font-medium cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;