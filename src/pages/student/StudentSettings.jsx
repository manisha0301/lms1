// src/pages/student/StudentSettings.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Lock,
  Bell,
  Eye,
  Trash2,
  AlertTriangle,
  Save,
  Edit3,
  Settings,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';

export default function StudentSettings() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Refs for smooth scrolling
  const profileRef = useRef(null);
  const passwordRef = useRef(null);
  const notificationsRef = useRef(null);
  const dangerRef = useRef(null);

  // Mock initial data
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@codekart.com',
      phone: '+91 1234567890',
      university: 'Example University',
    },
    password: {
      current: '',
      new: '',
      confirm: '',
    },
    notifications: {
      email: true,
      push: true,
    },
  });

  const [editData, setEditData] = useState({ ...settings });

  const handleSave = () => {
    if (editData.password.new && editData.password.new !== editData.password.confirm) {
      alert('New passwords do not match!');
      return;
    }
    setSettings({ ...editData });
    setIsEditing(false);
    alert('Settings saved successfully!');
    // Reset password fields
    setEditData(prev => ({
      ...prev,
      password: { current: '', new: '', confirm: '' },
    }));
  };

  const handleCancel = () => {
    setEditData({ ...settings });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    alert('Account deletion requested.');
    setShowDeleteConfirm(false);
    navigate('/');
  };

  const toggleNotification = (type) => {
    if (!isEditing) return;
    setEditData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] },
    }));
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const refs = {
      profile: profileRef,
      password: passwordRef,
      notifications: notificationsRef,
      danger: dangerRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] shadow-sm p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-white mt-1">Manage your account preferences</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] rounded-2xl font-bold hover:shadow-lg transition shadow-md cursor-pointer"
            >
              <Edit3 className="w-5 h-5" /> Edit Settings
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-white text-white rounded-2xl hover:bg-white/20 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition font-bold cursor-pointer"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1e3a8a]" />
                Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-[#1e3a8a] text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Information */}
            <div ref={profileRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <User className="w-7 h-7 text-[#1e3a8a]" />
                Profile Information
              </h3>

              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-[#1e3a8a] overflow-hidden">
                    {profilePic ? (
                      <img
                        src={URL.createObjectURL(profilePic)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      editData.profile.firstName[0] + editData.profile.lastName[0]
                    )}
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="profilePic"
                      className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                    >
                      <Edit3 className="w-5 h-5 text-[#1e3a8a]" />
                      <input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePic(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {isEditing && <p className="text-sm text-gray-500 mt-3">Click the pencil to upload a new photo</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'First Name', key: 'firstName', icon: User },
                  { label: 'Last Name', key: 'lastName', icon: User },
                  { label: 'Email Address', key: 'email', icon: Mail },
                  { label: 'Phone Number', key: 'phone', icon: Phone },
                  { label: 'University', key: 'university', icon: GraduationCap, colSpan: 'md:col-span-2' },
                ].map((field) => (
                  <div key={field.key} className={`space-y-2 ${field.colSpan || ''}`}>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <field.icon className="w-4 h-4" />
                      {field.label}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.profile[field.key]}
                        onChange={(e) =>
                          setEditData(prev => ({
                            ...prev,
                            profile: { ...prev.profile, [field.key]: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    ) : (
                      <p className="font-medium text-gray-800">{settings.profile[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div ref={passwordRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Lock className="w-7 h-7 text-[#1e3a8a]" />
                Change Password
              </h3>
              {isEditing ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {['current', 'new', 'confirm'].map((key) => (
                    <div key={key} className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {key === 'current' ? 'Current' : key === 'new' ? 'New' : 'Confirm New'} Password
                      </p>
                      <input
                        type="password"
                        value={editData.password[key]}
                        onChange={(e) =>
                          setEditData(prev => ({
                            ...prev,
                            password: { ...prev.password, [key]: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Click "Edit Settings" to change your password.</p>
              )}
            </div>

            {/* Notification Preferences */}
            <div ref={notificationsRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Bell className="w-7 h-7 text-[#1e3a8a]" />
                Notification Preferences
              </h3>
              <div className="space-y-8">
                {[
                  { type: 'email', label: 'Email Notifications', icon: Mail },
                  { type: 'push', label: 'Push Notifications', icon: Globe },
                ].map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Icon className="w-6 h-6 text-gray-500" />
                        <p className="font-medium">{notif.label}</p>
                      </div>
                      <button
                        onClick={() => toggleNotification(notif.type)}
                        disabled={!isEditing}
                        className={`relative w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                          editData.notifications[notif.type] ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                        } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            editData.notifications[notif.type] ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Zone */}
            <div ref={dangerRef} className="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-8 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-red-600" />
                Danger Zone
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently remove your account and all data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-600" />
              Confirm Account Deletion
            </h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete your account? This action is irreversible and all associated data will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}