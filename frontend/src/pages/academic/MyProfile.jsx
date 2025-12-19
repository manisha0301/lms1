// src/pages/MyProfile.jsx
import React, { useState } from 'react';
import { ArrowLeft, Users, Mail, Phone, MapPin, Briefcase, GraduationCap, Edit2, X, Save, Upload, Key } from 'lucide-react';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@kristellar.com",
    phone: "+91 98765 43210",
    address: "Kristellar HQ, Pune, Maharashtra",
    role: "Academic Administrator",
    qualification: "M.Tech in Computer Science",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  });
  const [profilePreview, setProfilePreview] = useState(profileData.profilePic);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setProfileData({ ...profileData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    alert("Password changed successfully!");
    setIsChangePasswordOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matching other pages */}
      <div className="bg-[#1e3a8a] text-white py-6">
        <div className="mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-semibold">My Profile</h1>
                <p className="mt-2 text-blue-100">View and edit your personal information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition cursor-pointer">
                <Edit2 className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSave} className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition cursor-pointer">
                <Save className="w-5 h-5 inline mr-2" /> Save Changes
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-left">
              <img src={profilePreview} alt="Profile" className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 mx-auto shadow-lg" />
              {isEditing && (
                <div className="mt-4">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="profile-pic" />
                  <label htmlFor="profile-pic" className="px-4 py-2 bg-[#1e40af] text-white rounded-md cursor-pointer hover:bg-[#1e3a8a] inline-flex items-left gap-2">
                    <Upload className="w-4 h-4" /> Change Photo
                  </label>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              {[
                { label: "Full Name", icon: Users, key: "name" },
                { label: "Email Address", icon: Mail, key: "email", type: "email" },
                { label: "Phone Number", icon: Phone, key: "phone" },
                { label: "Address", icon: MapPin, key: "address" },
                { label: "Role", icon: Briefcase, key: "role", disabled: true },
                { label: "Qualification", icon: GraduationCap, key: "qualification" },
              ].map((field, i) => (
                <div key={i} className="flex items-center gap-3">
                  <field.icon className="w-5 h-5 text-[#1e40af]" />
                  {isEditing && !field.disabled ? (
                    <input
                      type={field.type || "text"}
                      value={profileData[field.key]}
                      onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData[field.key]}</span>
                  )}
                </div>
              ))}
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="mt-4 px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-5 h-5" /> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
              <button onClick={() => setIsChangePasswordOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
              />
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button onClick={() => setIsChangePasswordOpen(false)} className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePasswordChange} className="px-8 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] shadow-md">
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