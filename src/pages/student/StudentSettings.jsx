// src/pages/student/StudentSettings.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ChevronLeft, User, Mail, Phone, GraduationCap, Lock, Bell, Trash2, Save, Edit2, Settings
} from 'lucide-react';

export default function StudentSettings() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@codekart.com',
    phone: '+91 1234567890',
    university: 'Example University',
    password: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
  });

  const [profilePic, setProfilePic] = useState(null); // Simulated upload
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save (add API call here)
    console.log('Saved settings:', formData);
    setSuccessMessage('Settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure? This action is irreversible.')) {
      console.log('Account deletion requested');
      navigate('/'); // Redirect to home/login
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Same Navbar as Dashboard - Copy from CoursesDashboard.jsx if shared */}
      {/* For brevity, assuming it's wrapped in a layout or copy the header code here */}

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/student/dash')} 
          className="flex items-center gap-2 text-[#1e3a8a] font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1e3a8a] text-white p-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Settings className="w-7 h-7" /> Account Settings
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-[#1e3a8a] overflow-hidden">
                  {profilePic ? (
                    <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName[0] + formData.lastName[0]
                  )}
                </div>
                <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <Edit2 className="w-4 h-4 text-[#1e3a8a]" />
                  <input 
                    id="profilePic" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setProfilePic(e.target.files[0])} 
                    className="hidden" 
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Upload a new profile picture</p>
            </div>

            {/* Personal Info */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#1e3a8a]" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation University</label>
                  <input 
                    name="university" 
                    value={formData.university} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                    required 
                  />
                </div>
              </div>
            </section>

            {/* Password */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#1e3a8a]" /> Change Password
              </h2>
              <div className="space-y-4">
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Current Password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                />
                <input 
                  name="newPassword" 
                  type="password" 
                  placeholder="New Password" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                />
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm New Password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a] transition" 
                />
              </div>
            </section>

            {/* Notifications */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1e3a8a]" /> Notification Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    checked={formData.emailNotifications} 
                    onChange={handleChange} 
                    className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]" 
                  />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="pushNotifications" 
                    checked={formData.pushNotifications} 
                    onChange={handleChange} 
                    className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]" 
                  />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </label>
              </div>
            </section>

            {/* Save Button */}
            <button 
              type="submit" 
              className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-xl transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
            {successMessage && (
              <p className="text-center text-emerald-600 font-medium mt-4">{successMessage}</p>
            )}
          </form>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all data.</p>
            <button 
              onClick={handleDelete} 
              className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-medium py-3 rounded-xl transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}