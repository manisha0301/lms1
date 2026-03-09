// src/pages/superadmin/MyProfile.jsx
import { useEffect, useState } from 'react';
import { 
  Mail, 
  Edit3,
  Save,
  X,
  Clock,
  Activity,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

export default function MyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'superadmin@kristellar.com',
    phone: 'N/A',
    joiningDate: 'N/A',
  });
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
  });
  const [usersManaged, setUsersManaged] = useState(0); // Real count
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('superAdminToken');

        // 1. Fetch profile (name, email, phone, created_at)
        const profileRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (profileRes.data.success) {
          const user = profileRes.data.user;
          const formattedDate = user.created_at
            ? new Date(user.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'N/A';

          setProfile({
            name: user.full_name || 'Super Admin',
            email: user.email,
            phone: user.phone || 'N/A',
            joiningDate: formattedDate,
          });

          setEditData({
            name: user.full_name || 'Super Admin',
            phone: user.phone || '',
          });

          // Persist phone in localStorage
          localStorage.setItem('superAdminPhone', user.phone || 'N/A');
        }

        // 2. Fetch real Users Managed count (students + faculties + academic admins)
        const countRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/user-count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (countRes.data.success) {
          setUsersManaged(countRes.data.totalUsers);
          // Persist user count in localStorage
          localStorage.setItem('superAdminUsersManaged', countRes.data.totalUsers);
        }
      } catch (error) {
        // On error, try to load from localStorage
        setProfile(prev => ({
          ...prev,
          phone: localStorage.getItem('superAdminPhone') || prev.phone
        }));
        setUsersManaged(Number(localStorage.getItem('superAdminUsersManaged')) || 0);
        console.error('Failed to fetch profile/users data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Name validation
    const trimmedName = editData.name.trim();
    if (!trimmedName) {
      // We'll show error under field instead of alert
    }
    const nameRegex = /^[A-Za-z ]+$/;
    if (trimmedName && !nameRegex.test(trimmedName)) {
      // Error shown under field
    }
    if (trimmedName && (trimmedName.length < 2 || trimmedName.length > 100)) {
      // Error shown under field
    }

    // Phone validation (optional but strict if provided)
    let cleanedPhone = null;
    if (editData.phone.trim()) {
      cleanedPhone = editData.phone.replace(/[\s\-+]/g, '');
      const phoneRegex = /^[6789]\d{9}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        // Error shown under field
      }
    }

    // If any validation fails, don't proceed (errors are shown under fields)
    if (
      !trimmedName ||
      !nameRegex.test(trimmedName) ||
      trimmedName.length < 2 ||
      trimmedName.length > 100 ||
      (editData.phone.trim() && !/^[6789]\d{9}$/.test(cleanedPhone))
    ) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.put(
        `${apiConfig.API_BASE_URL}/api/auth/superadmin/profile`,
        {
          fullName: trimmedName,
          phone: cleanedPhone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          name: response.data.profile.full_name || 'Super Admin',
          phone: response.data.profile.phone || 'N/A',
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profile });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Reset previous field errors (we'll set them conditionally)
    setPasswordData(prev => ({ ...prev, errors: {} }));

    let hasError = false;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      hasError = true;
      setPasswordData(prev => ({
        ...prev,
        errors: { ...prev.errors, confirmPassword: "Passwords do not match" }
      }));
    }

    if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) {
      hasError = true;
      setPasswordData(prev => ({
        ...prev,
        errors: { ...prev.errors, newPassword: "Password must be between 8 and 16 characters long" }
      }));
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      hasError = true;
      setPasswordData(prev => ({
        ...prev,
        errors: { ...prev.errors, newPassword: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }
      }));
    }

    if (hasError) return;

    try {
      const token = localStorage.getItem('superAdminToken');
      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/superadmin/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Password changed successfully!");
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to change password.");
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const uptime = "99.9%"; // Dummy as requested

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] border border-gray-200 shadow-sm p-8">
        <div className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-white mt-1">Manage your personal information and security settings</p>
          </div>
        </div>
      </div>

      <div className="mx-auto px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  SA
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.name}</h2>
                <p className="text-[#1e3a8a] font-medium">Super Admin</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <Users className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{usersManaged.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Users Managed</p>
                  </div>
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{uptime}</p>
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
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <>
                      <input 
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition ${
                          editData.name.trim() &&
                          (
                            !/^[A-Za-z ]+$/.test(editData.name.trim()) ||
                            editData.name.trim().length < 2 ||
                            editData.name.trim().length > 100
                          )
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {editData.name.trim() && (
                        (!/^[A-Za-z ]+$/.test(editData.name.trim()) && (
                          <p className="mt-1 text-sm text-red-600">
                            Full name must contain only letters and spaces.
                          </p>
                        )) ||
                        (editData.name.trim().length < 2 && (
                          <p className="mt-1 text-sm text-red-600">
                            Full name is too short (minimum 2 characters).
                          </p>
                        )) ||
                        (editData.name.trim().length > 100 && (
                          <p className="mt-1 text-sm text-red-600">
                            Full name is too long (maximum 100 characters).
                          </p>
                        ))
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <>
                      <input 
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition ${
                          editData.phone.trim() &&
                          !/^[6789]\d{9}$/.test(editData.phone.replace(/[\s\-+]/g, ''))
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {editData.phone.trim() &&
                        !/^[6789]\d{9}$/.test(editData.phone.replace(/[\s\-+]/g, '')) && (
                          <p className="mt-1 text-sm text-red-600">
                            Phone number must be a valid 10-digit number (e.g., 9876543210)
                          </p>
                        )}
                    </>
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
                <button 
                  onClick={() => setIsPasswordModalOpen(true)} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium cursor-pointer"
                >
                  <Key className="w-5 h-5" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Change Password</h3>
                    <button
                      onClick={closePasswordModal}
                      className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition ${
                            passwordData.newPassword &&
                            (
                              passwordData.newPassword.length < 8 ||
                              passwordData.newPassword.length > 16 ||
                              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/.test(passwordData.newPassword)
                            )
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {passwordData.newPassword && (
                          (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) && (
                            <p className="mt-1 text-sm text-red-600">
                              Password must be between 8 and 16 characters long.
                            </p>
                          )
                        )}
                        {passwordData.newPassword &&
                          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/.test(passwordData.newPassword) && (
                            <p className="mt-1 text-sm text-red-600">
                              Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition ${
                            passwordData.confirmPassword &&
                            passwordData.newPassword !== passwordData.confirmPassword
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {passwordData.confirmPassword &&
                          passwordData.newPassword !== passwordData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              Passwords do not match
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        type="button"
                        onClick={closePasswordModal}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-5 h-5" />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2026 Kristellar • Super Admin Portal
      </footer>
    </div>
  );
}