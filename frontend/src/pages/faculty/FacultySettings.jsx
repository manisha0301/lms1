// src/pages/faculty/FacultySettings.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Eye, 
  Globe, 
  Moon, 
  Sun, 
  LogOut, 
  Save, 
  X, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Edit3,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';

export default function FacultySettings() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for each section
  const profileRef = useRef(null);
  const passwordRef = useRef(null);
  const notificationsRef = useRef(null);
  const appearanceRef = useRef(null);
  const dangerRef = useRef(null);

  // Real profile data (fetched from API)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [editData, setEditData] = useState({
    profile: { ...profile },
    password: { current: '', new: '', confirm: '' },
    notifications: { email: true, push: true, sms: false },
    appearance: { darkMode: false }
  });

  // NEW: Password validation errors
  const [passwordErrors, setPasswordErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch real faculty profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('facultyToken');
        if (!token) {
          navigate('/faculty/login');
          return;
        }

        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.profile) {
          const data = res.data.profile;
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || ''
          });
          setEditData(prev => ({
            ...prev,
            profile: {
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || ''
            }
          }));
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        const errorMsg = err.response?.data?.error || 'Unable to load profile';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // NEW: Validate password fields in real-time
  const validatePasswordField = (field, value) => {
    const errors = { ...passwordErrors };

    if (field === 'current') {
      errors.current = !value ? 'Current password is required' : '';
    }

    if (field === 'new') {
      if (!value) {
        errors.new = 'New password is required';
      } else if (value.length < 8 || value.length > 16) {
        errors.new = 'Password must be 8–16 characters long';
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
        errors.new = passwordRegex.test(value) 
          ? '' 
          : 'Password must contain uppercase, lowercase, number & special character';
      }
    }

    if (field === 'confirm') {
      errors.confirm = value !== editData.password.new 
        ? 'Passwords do not match' 
        : '';
    }

    setPasswordErrors(errors);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('facultyToken');
      if (!token) {
        navigate('/faculty/login');
        return;
      }

      const res = await axios.put(
        `${apiConfig.API_BASE_URL}/api/faculty/profile`,
        {
          name: editData.profile.name,
          email: editData.profile.email,
          phone: editData.profile.phone
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setProfile({ ...editData.profile });
        alert('Profile updated successfully!');
      } else {
        alert(res.data.error || 'Failed to update profile');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Profile update failed. Please try again.';
      alert(errorMsg);
      console.error('Profile update error:', err);
    }
  };

  const handleChangePassword = async () => {
    // Final validation check
    validatePasswordField('current', editData.password.current);
    validatePasswordField('new', editData.password.new);
    validatePasswordField('confirm', editData.password.confirm);

    if (Object.values(passwordErrors).some(err => err !== '')) {
      alert('Please fix password validation errors before saving.');
      return;
    }

    if (!editData.password.current || !editData.password.new || !editData.password.confirm) {
      alert('All password fields are required');
      return;
    }

    if (editData.password.new !== editData.password.confirm) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('facultyToken');
      const res = await axios.put(
        `${apiConfig.API_BASE_URL}/api/faculty/change-password`,
        {
          currentPassword: editData.password.current,
          newPassword: editData.password.new,
          confirmPassword: editData.password.confirm,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert('Password changed successfully!');
        setEditData(prev => ({
          ...prev,
          password: { current: '', new: '', confirm: '' }
        }));
        setPasswordErrors({ current: '', new: '', confirm: '' });
      } else {
        alert(res.data.error || 'Failed to change password');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Password change failed. Please try again.';
      alert(errorMsg);
      console.error('Password change error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('facultyToken');
      const res = await axios.delete(`${apiConfig.API_BASE_URL}/api/faculty/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/faculty/login');
      } else {
        alert(res.data.error || 'Failed to delete account');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Account deletion failed. Please try again.';
      alert(errorMsg);
      console.error('Delete account error:', err);
    }
  };

  const handleSave = async () => {
    if (activeSection === 'profile') {
      await handleSaveProfile();
    } else if (activeSection === 'password') {
      await handleChangePassword();
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      profile: { ...profile },
      password: { current: '', new: '', confirm: '' },
      notifications: { email: true, push: true, sms: false },
      appearance: { darkMode: false }
    });
    setPasswordErrors({ current: '', new: '', confirm: '' });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/login');
  };

  const toggleNotification = (type) => {
    if (!isEditing) return;
    setEditData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] }
    }));
  };

  const toggleDarkMode = () => {
    if (!isEditing) return;
    setEditData(prev => ({
      ...prev,
      appearance: { ...prev.appearance, darkMode: !prev.appearance.darkMode }
    }));
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const refs = {
      profile: profileRef,
      password: passwordRef,
      notifications: notificationsRef,
      appearance: appearanceRef,
      danger: dangerRef
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] shadow-sm p-8">
        <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-white mt-1">Customize your account preferences</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] rounded-2xl font-bold hover:shadow-lg transition shadow-md"
            >
              <Edit3 className="w-5 h-5" /> Edit Settings
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={handleCancel}
                className="px-6 py-3 border border-white text-white rounded-2xl hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition font-bold"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1e3a8a]" />
                Settings Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
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

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Password Settings */}
            <div ref={passwordRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Lock className="w-7 h-7 text-[#1e3a8a]" />
                Change Password
              </h3>
              {isEditing ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: "Current Password", key: "current" },
                    { label: "New Password", key: "new" },
                    { label: "Confirm New Password", key: "confirm" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        {field.label}
                      </p>
                      <div className="relative">
                        <input
                          type="password"
                          value={editData.password[field.key]}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditData(prev => ({
                              ...prev,
                              password: { ...prev.password, [field.key]: value }
                            }));
                            validatePasswordField(field.key, value);
                          }}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] transition ${
                            passwordErrors[field.key] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {passwordErrors[field.key] && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors[field.key]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Click 'Edit Settings' to change your password.</p>
              )}
            </div>

            {/* Notification Settings */}
            <div ref={notificationsRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Bell className="w-7 h-7 text-[#1e3a8a]" />
                Notification Preferences
              </h3>
              <div className="space-y-8">
                {[
                  { type: 'email', label: 'Email Notifications', icon: Mail },
                  { type: 'push', label: 'Push Notifications', icon: Globe },
                  { type: 'sms', label: 'SMS Alerts', icon: Phone },
                ].map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Icon className="w-6 h-6 text-gray-500" />
                        <div>
                          <p className="font-medium">{notif.label}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleNotification(notif.type)}
                        className={`relative w-14 h-8 rounded-full p-1 transition-colors ${
                          editData.notifications[notif.type] ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                        } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div className={`absolute top-1 left-1 w-6 h-6 transform rounded-full bg-white transition ${
                          editData.notifications[notif.type] ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appearance Settings */}
            <div ref={appearanceRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Eye className="w-7 h-7 text-[#1e3a8a]" />
                Appearance
              </h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {editData.appearance.darkMode ? <Moon className="w-6 h-6 text-gray-500" /> : <Sun className="w-6 h-6 text-gray-500" />}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-14 h-8 rounded-full p-1 transition-colors ${
                      editData.appearance.darkMode ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                    } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 transform rounded-full bg-white transition ${
                      editData.appearance.darkMode ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div ref={dangerRef} className="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-8 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-red-600" />
                Danger Zone
              </h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trash2 className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-600" />
              Confirm Account Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Cybernetics LMS • Faculty Portal
      </footer>
    </div>
  );
}