// src/pages/superadmin/Settings.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  Settings,
  Bell,
  Mail,
  Lock,
  Database,
  Globe,
  Palette,
  Save,
  X,
  Edit3,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminSettings() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');

  // Refs for each section to enable smooth scrolling
  const notificationsRef = useRef(null);
  const securityRef = useRef(null);
  const systemRef = useRef(null);
  const appearanceRef = useRef(null);

  // Mock Settings Data
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      dailySummary: false
    },
    security: {
      require2FA: true,
      sessionTimeout: '30 minutes'
    },
    system: {
      backupFrequency: 'Daily',
      timezone: 'IST (UTC+5:30)'
    },
    appearance: {
      theme: 'Light',
      primaryColor: '#1e3a8a'
    }
  });

  const [editData, setEditData] = useState({ ...settings });

  const handleSave = () => {
    setSettings({ ...editData });
    setIsEditing(false);
    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    setEditData({ ...settings });
    setIsEditing(false);
  };

  const toggleNotification = (key) => {
    setEditData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const toggleSecurity = (key) => {
    setEditData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: !prev.security[key]
      }
    }));
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const refs = {
      notifications: notificationsRef,
      security: securityRef,
      system: systemRef,
      appearance: appearanceRef
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'system', label: 'System Configuration', icon: Database },
    { id: 'appearance', label: 'Appearance & Theme', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] shadow-sm p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
            <p className="text-white mt-1">Configure platform preferences and security</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-gray-500">Receive alerts via email</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing && toggleNotification('emailAlerts')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      editData.notifications.emailAlerts ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                    } ${!isEditing && 'opacity-60'}`}
                    disabled={!isEditing}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      editData.notifications.emailAlerts ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing && toggleNotification('pushNotifications')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      editData.notifications.pushNotifications ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                    } ${!isEditing && 'opacity-60'}`}
                    disabled={!isEditing}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      editData.notifications.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Daily Summary Emails</p>
                      <p className="text-sm text-gray-500">End-of-day summary report</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing && toggleNotification('dailySummary')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      editData.notifications.dailySummary ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                    } ${!isEditing && 'opacity-60'}`}
                    disabled={!isEditing}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      editData.notifications.dailySummary ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div ref={securityRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Lock className="w-7 h-7 text-[#1e3a8a]" />
                Security & Access
              </h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Require 2FA for All Admins</p>
                      <p className="text-sm text-gray-500">Enforce two-factor authentication</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing && toggleSecurity('require2FA')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                      editData.security.require2FA ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                    } ${!isEditing && 'opacity-60'}`}
                    disabled={!isEditing}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      editData.security.require2FA ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Session Timeout</label>
                  {isEditing ? (
                    <select 
                      value={editData.security.sessionTimeout}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900">{settings.security.sessionTimeout}</p>
                  )}
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div ref={systemRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Database className="w-7 h-7 text-[#1e3a8a]" />
                System Configuration
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Backup Frequency</label>
                  {isEditing ? (
                    <select 
                      value={editData.system.backupFrequency}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        system: { ...prev.system, backupFrequency: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900">{settings.system.backupFrequency}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Default Timezone</label>
                  {isEditing ? (
                    <select 
                      value={editData.system.timezone}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        system: { ...prev.system, timezone: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option>UTC</option>
                      <option>IST (UTC+5:30)</option>
                      <option>EST (UTC-5)</option>
                      <option>PST (UTC-8)</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900">{settings.system.timezone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div ref={appearanceRef} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Palette className="w-7 h-7 text-[#1e3a8a]" />
                Appearance & Theme
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
                  {isEditing ? (
                    <select 
                      value={editData.appearance.theme}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900">{settings.appearance.theme}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Primary Color</label>
                  {isEditing ? (
                    <input 
                      type="color"
                      value={editData.appearance.primaryColor}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, primaryColor: e.target.value }
                      }))}
                      className="w-full h-16 border border-gray-300 rounded-xl cursor-pointer"
                    />
                  ) : (
                    <div className="w-full h-32 rounded-xl shadow-inner" style={{ backgroundColor: settings.appearance.primaryColor }}></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Kristellar • Super Admin Portal
      </footer>
    </div>
  );
}