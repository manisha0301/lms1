// src/pages/AcademicSettings.jsx
import { useState, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  Bell, 
  Eye, 
  Globe, 
  Save, 
  X, 
  Trash2, 
  Edit3,
  Settings,
  Palette,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const AcademicSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');

  // Refs for each section
  const notificationsRef = useRef(null);
  const appearanceRef = useRef(null);
  const regionalRef = useRef(null);

  const [settings, setSettings] = useState({
    notifications: {
      enable: true,
      email: true,
      sms: false
    },
    appearance: {
      theme: 'light'
    },
    regional: {
      timezone: 'Asia/Kolkata',
      language: 'English'
    }
  });

  const [editData, setEditData] = useState({ ...settings });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setSettings({ ...editData });
    setIsEditing(false);
    alert("Settings saved successfully!");
  };

  const handleCancel = () => {
    setEditData({ ...settings });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    alert("Account deletion requested. Please contact admin.");
    setShowDeleteConfirm(false);
  };

  const toggleNotification = (type) => {
    if (!isEditing) return;
    setEditData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] }
    }));
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const refs = {
      notifications: notificationsRef,
      appearance: appearanceRef,
      regional: regionalRef
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'regional', label: 'Regional Settings', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] shadow-sm p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
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

      <div className="max-w-[1600px] mx-auto px-8 pb-12">
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
            {/* Notification Settings */}
            <div ref={notificationsRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Bell className="w-7 h-7 text-[#1e3a8a]" />
                Notification Preferences
              </h3>
              <div className="space-y-8">
                {[
                  { type: 'enable', label: 'Enable Notifications', icon: Bell },
                  { type: 'email', label: 'Email Alerts', icon: Mail },
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
                <Palette className="w-7 h-7 text-[#1e3a8a]" />
                Appearance
              </h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Palette className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Theme</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <select
                      value={editData.appearance.theme}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value }
                      }))}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 rounded-md">{settings.appearance.theme.charAt(0).toUpperCase() + settings.appearance.theme.slice(1)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Regional Settings */}
            <div ref={regionalRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Globe className="w-7 h-7 text-[#1e3a8a]" />
                Regional Settings
              </h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Globe className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Timezone</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <select
                      value={editData.regional.timezone}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        regional: { ...prev.regional, timezone: e.target.value }
                      }))}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New York (EST)</option>
                    </select>
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 rounded-md">{settings.regional.timezone}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Globe className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Language</p>
                    </div>
                  </div>
                  {isEditing ? (
                    <select
                      value={editData.regional.language}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        regional: { ...prev.regional, language: e.target.value }
                      }))}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 rounded-md">{settings.regional.language}</span>
                  )}
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
        © 2025 Kristellar Academy • Academic Portal
      </footer>
    </div>
  );
};

export default AcademicSettings;