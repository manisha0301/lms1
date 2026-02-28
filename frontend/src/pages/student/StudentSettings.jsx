// src/pages/student/StudentSettings.jsx
import { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';

export default function StudentSettings() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  // Real profile data (fetched from API)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
  });

  const [editData, setEditData] = useState({ ...profile });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  // Refs for smooth scrolling
  const profileRef = useRef(null);
  const passwordRef = useRef(null);
  const notificationsRef = useRef(null);
  const dangerRef = useRef(null);

  // Fetch real student profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/auth/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.profile) {
          const data = res.data.profile;
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            university: data.university || '',
          });
          setEditData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            university: data.university || '',
          });
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.put(
        `${apiConfig.API_BASE_URL}/api/auth/student/profile`,
        {
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone,
          university: editData.university,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setProfile({ ...editData });
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(res.data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('All password fields are required');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }

    console.log('Attempting to change password with data:', passwordData);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${apiConfig.API_BASE_URL}/api/auth/student/change-password`,
        {
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
          confirmPassword: passwordData.confirm, // FIXED: Added this field
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert('Password changed successfully!');
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        alert(res.data.error || 'Failed to change password');
      }
    } catch (err) {
      // IMPROVED: Show real backend error message
      const errorMessage = err.response?.data?.error || 'Failed to change password. Please try again.';
      alert(errorMessage);
      console.error('Password change error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${apiConfig.API_BASE_URL}/api/auth/student/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Account deleted successfully');
        navigate('/login');
      } else {
        alert(res.data.error || 'Failed to delete account');
      }
    } catch (err) {
      alert('Failed to delete account: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSave = () => {
    // if (activeSection === 'profile') {
      // handleSaveProfile();
    // } else if (activeSection === 'password') {
      handleChangePassword();
    // }
    // Notifications can be saved immediately or on toggle if you want
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setPasswordData({ current: '', new: '', confirm: '' });
    setIsEditing(false);
  };

  const toggleNotification = (type) => {
    if (!isEditing) return;
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
    // You can add API call here to save immediately if needed
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
    // { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] shadow-sm p-8">
        <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
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

      <div className="mx-auto px-8 pb-12">
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
            {/*  */}

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
                        {key === 'current' ? 'Current Password' : key === 'new' ? 'New Password' : 'Confirm New Password'}
                      </p>
                      <input
                        type="password"
                        value={passwordData[key]}
                        onChange={(e) =>
                          setPasswordData(prev => ({
                            ...prev,
                            [key]: e.target.value,
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
                          notifications[notif.type] ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                        } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            notifications[notif.type] ? 'translate-x-6' : ''
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